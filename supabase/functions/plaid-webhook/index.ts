import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const PLAID_CLIENT_ID = Deno.env.get('PLAID_CLIENT_ID') || ''
const PLAID_SECRET = Deno.env.get('PLAID_SECRET') || ''
const PLAID_ENV = Deno.env.get('PLAID_ENV') || 'sandbox'
const PLAID_WEBHOOK_SECRET = Deno.env.get('PLAID_WEBHOOK_SECRET') || ''

/*
  Plaid Webhook Receiver
  Handles real-time Plaid events:
  - TRANSACTIONS: SYNC_UPDATES_AVAILABLE, DEFAULT_UPDATE
  - ITEM: ERROR, PENDING_EXPIRATION, LOGIN_REPAIRED
  - HOLDINGS: DEFAULT_UPDATE
*/

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type, Plaid-Verification' } });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  try {
    const body = await req.json();
    const webhookType = body.webhook_type; // TRANSACTIONS, ITEM, HOLDINGS
    const webhookCode = body.webhook_code; // SYNC_UPDATES_AVAILABLE, ERROR, etc.
    const itemId = body.item_id;

    console.log(`plaid-webhook: ${webhookType}.${webhookCode} for item ${itemId}`);

    // Find the integration by item_id
    const { data: integrations } = await sb.from('integrations').select('id, org_id, config').eq('provider', 'plaid').eq('status', 'connected');
    const integration = (integrations || []).find((i: any) => (i.config as any)?.item_id === itemId);

    if (!integration) {
      console.warn(`plaid-webhook: No integration found for item ${itemId}`);
      return new Response(JSON.stringify({ received: true, matched: false }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const orgId = integration.org_id;
    const config = integration.config as any;

    // === TRANSACTIONS: New data available ===
    if (webhookType === 'TRANSACTIONS' && (webhookCode === 'SYNC_UPDATES_AVAILABLE' || webhookCode === 'DEFAULT_UPDATE')) {
      // Trigger incremental sync
      if (PLAID_CLIENT_ID && PLAID_SECRET && config.access_token) {
        const base = `https://${PLAID_ENV}.plaid.com`;
        const syncRes = await fetch(`${base}/transactions/sync`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ client_id: PLAID_CLIENT_ID, secret: PLAID_SECRET, access_token: config.access_token, cursor: config.transaction_cursor || undefined, count: 500 }),
        });

        if (syncRes.ok) {
          const data = await syncRes.json();
          const { data: accounts } = await sb.from('gl_accounts').select('id, external_id').eq('org_id', orgId).eq('provider', 'plaid');
          const acctMap: Record<string, string> = {}; (accounts || []).forEach((a: any) => { if (a.external_id) acctMap[a.external_id] = a.id; });

          let synced = 0;
          for (const txn of (data.added || [])) {
            const accountId = acctMap[txn.account_id]; if (!accountId) continue;
            await sb.from('gl_transactions').upsert({
              org_id: orgId, account_id: accountId, provider: 'plaid', external_id: txn.transaction_id,
              txn_date: txn.date, amount: -txn.amount, description: txn.name || txn.merchant_name || '',
              period: (txn.date || '').slice(0, 7), currency: txn.iso_currency_code || 'USD',
              synced_at: new Date().toISOString(),
            }, { onConflict: 'org_id,provider,external_id', ignoreDuplicates: false });
            synced++;
          }

          // Update cursor
          if (data.next_cursor) {
            await sb.from('integrations').update({
              config: { ...config, transaction_cursor: data.next_cursor },
              last_sync_at: new Date().toISOString(),
              records_synced: (integration as any).records_synced + synced,
            }).eq('id', integration.id);
          }

          await sb.from('sync_log').insert({
            org_id: orgId, integration_id: integration.id, provider: 'plaid', status: 'success',
            records_synced: synced, completed_at: new Date().toISOString(),
            metadata: { trigger: 'plaid_webhook', webhook_code: webhookCode, added: (data.added || []).length, modified: (data.modified || []).length, removed: (data.removed || []).length },
          });

          console.log(`plaid-webhook: Synced ${synced} transactions for org ${orgId}`);
        }
      }
    }

    // === ITEM: Credential error — needs re-auth ===
    if (webhookType === 'ITEM' && webhookCode === 'ERROR') {
      const errorCode = body.error?.error_code;
      if (errorCode === 'ITEM_LOGIN_REQUIRED') {
        await sb.from('integrations').update({ status: 'needs_reauth', last_error: 'Bank requires re-authentication' }).eq('id', integration.id);

        // Create alert
        await sb.from('financial_alerts').insert({
          org_id: orgId, alert_type: 'integration_error', severity: 'high',
          title: 'Bank connection requires re-authentication',
          description: 'Your bank connection has expired. Please re-authenticate in Settings > Integrations to continue receiving transaction data.',
          metadata: { provider: 'plaid', item_id: itemId, error_code: errorCode },
        });

        // Notify owner
        const { data: owner } = await sb.from('users').select('id').eq('org_id', orgId).eq('role', 'owner').maybeSingle();
        if (owner) {
          await sb.from('notifications').insert({
            org_id: orgId, user_id: owner.id, channel: 'in_app',
            title: 'Bank connection needs re-authentication',
            body: 'Your bank requires you to log in again. Go to Settings > Integrations to reconnect.',
            link: '/login',
          });
        }
      }
    }

    // === ITEM: Login repaired ===
    if (webhookType === 'ITEM' && webhookCode === 'LOGIN_REPAIRED') {
      await sb.from('integrations').update({ status: 'connected', last_error: null }).eq('id', integration.id);
      // Resolve any existing reauth alerts
      await sb.from('financial_alerts').update({ status: 'resolved', resolved_at: new Date().toISOString() })
        .eq('org_id', orgId).eq('alert_type', 'integration_error').eq('status', 'active');
    }

    // === ITEM: Pending expiration warning ===
    if (webhookType === 'ITEM' && webhookCode === 'PENDING_EXPIRATION') {
      await sb.from('financial_alerts').insert({
        org_id: orgId, alert_type: 'integration_error', severity: 'medium',
        title: 'Bank connection will expire soon',
        description: 'Your bank connection is about to expire. Please re-authenticate in Settings > Integrations within the next 7 days.',
        metadata: { provider: 'plaid', item_id: itemId, consent_expiration_time: body.consent_expiration_time },
      });
    }

    // Log webhook event
    await sb.from('webhook_events').insert({
      provider: 'plaid', event_type: `${webhookType}.${webhookCode}`,
      payload: body, processed: true, org_id: orgId,
    }).catch(() => {});

    return new Response(JSON.stringify({ received: true, processed: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (err: any) {
    console.error('plaid-webhook error:', err);
    return new Response(JSON.stringify({ received: true, error: err?.message }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
});
