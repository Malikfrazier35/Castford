'use client';

import { useEffect } from 'react';

export default function V3SalesPitchValuePage() {
  

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `` }} />
      <div dangerouslySetInnerHTML={{ __html: `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;">
<tr><td align="center" style="padding:40px 20px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

<!-- Header -->
<tr>
<td style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:32px 40px;text-align:left;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td>
        <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Vaultline</span>
        <span style="font-size:12px;color:rgba(255,255,255,0.5);margin-left:8px;letter-spacing:1px;"></span>
      </td>
    </tr>
  </table>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:40px;">

  <p style="font-size:16px;color:#1a1a2e;margin:0 0 20px;line-height:1.6;">
    Hi {{first_name}},
  </p>

  <p style="font-size:16px;color:#1a1a2e;margin:0 0 20px;line-height:1.6;">
    I reached out last week about how mid-market treasury teams are modernizing their cash management stack. Wanted to follow up with something you can put numbers to.
  </p>

  <!-- The Numbers Box -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
    <tr>
      <td style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:20px 24px;">
        <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:1px;font-weight:600;">What Vaultline customers are seeing</p>
      </td>
    </tr>
    <tr>
      <td style="padding:0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="33%" style="padding:24px 16px;text-align:center;border-right:1px solid #e2e8f0;">
              <p style="margin:0;font-size:28px;font-weight:800;color:#0ea5e9;letter-spacing:-1px;">$84M+</p>
              <p style="margin:4px 0 0;font-size:11px;color:#8a8aad;text-transform:uppercase;letter-spacing:0.5px;">managed</p>
              <p style="margin:4px 0 0;font-size:12px;color:#4a4a6a;">Across entities</p>
            </td>
            <td width="33%" style="padding:24px 16px;text-align:center;border-right:1px solid #e2e8f0;">
              <p style="margin:0;font-size:28px;font-weight:800;color:#10b981;letter-spacing:-1px;">12</p>
              <p style="margin:4px 0 0;font-size:11px;color:#8a8aad;text-transform:uppercase;letter-spacing:0.5px;">bank accounts</p>
              <p style="margin:4px 0 0;font-size:12px;color:#4a4a6a;">One dashboard</p>
            </td>
            <td width="33%" style="padding:24px 16px;text-align:center;">
              <p style="margin:0;font-size:28px;font-weight:800;color:#f59e0b;letter-spacing:-1px;">4</p>
              <p style="margin:4px 0 0;font-size:11px;color:#8a8aad;text-transform:uppercase;letter-spacing:0.5px;">entities</p>
              <p style="margin:4px 0 0;font-size:12px;color:#4a4a6a;">Unified view</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- Treasury Day Scenarios -->
  <p style="font-size:16px;color:#1a1a2e;margin:0 0 20px;line-height:1.6;font-weight:700;">
    A day in the life of a treasury team on Vaultline:
  </p>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    <tr>
      <td style="padding:14px 16px;border-bottom:1px solid #f0f0f5;">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="vertical-align:top;padding-right:12px;">
              <span style="display:inline-block;width:28px;height:28px;background:#e0f2fe;border-radius:50%;text-align:center;line-height:28px;font-size:14px;">&#9776;</span>
            </td>
            <td>
              <p style="margin:0;font-size:14px;color:#1a1a2e;font-weight:600;">8:00 AM — Global Cash Position</p>
              <p style="margin:4px 0 0;font-size:13px;color:#6b6b8a;line-height:1.4;">Open Vaultline and see consolidated balances across all 12 bank accounts and 4 entities. No logging into 5 different bank portals. No copy-pasting into a master spreadsheet.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:14px 16px;border-bottom:1px solid #f0f0f5;">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="vertical-align:top;padding-right:12px;">
              <span style="display:inline-block;width:28px;height:28px;background:#ecfdf5;border-radius:50%;text-align:center;line-height:28px;font-size:14px;">&#9888;</span>
            </td>
            <td>
              <p style="margin:0;font-size:14px;color:#1a1a2e;font-weight:600;">10:30 AM — Anomaly Alert</p>
              <p style="margin:4px 0 0;font-size:13px;color:#6b6b8a;line-height:1.4;">AI flags an unusual $1.2M outflow from your European subsidiary. You investigate with one click, trace it to an early vendor payment, and approve it in the audit trail. Crisis averted before it started.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:14px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="vertical-align:top;padding-right:12px;">
              <span style="display:inline-block;width:28px;height:28px;background:#fffbeb;border-radius:50%;text-align:center;line-height:28px;font-size:14px;">&#128202;</span>
            </td>
            <td>
              <p style="margin:0;font-size:14px;color:#1a1a2e;font-weight:600;">3:00 PM — Board Prep</p>
              <p style="margin:4px 0 0;font-size:13px;color:#6b6b8a;line-height:1.4;">Generate a branded treasury report with entity breakdowns, liquidity ratios, and 90-day forecast. One click. 30 seconds. Your CFO forwards it directly to the board.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <p style="font-size:16px;color:#1a1a2e;margin:0 0 28px;line-height:1.6;">
    {{first_name}}, treasury teams at {{company_name}}'s stage shouldn't be spending their mornings reconciling bank statements. Vaultline makes that a thing of the past.
  </p>

  <!-- CTA -->
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 12px;">
    <tr>
      <td style="background:linear-gradient(135deg,#0ea5e9,#0284c7);border-radius:8px;text-align:center;">
        <a href="https://vaultline.app/demo" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.3px;">See It in Action &rarr;</a>
      </td>
    </tr>
  </table>
  <p style="font-size:13px;color:#8a8aad;text-align:center;margin:0 0 32px;">No commitment. 15 minutes. Built for your treasury stack.</p>

  <!-- Sign off -->
  <p style="font-size:16px;color:#1a1a2e;margin:0 0 4px;line-height:1.6;">Best,</p>
  <p style="font-size:16px;color:#1a1a2e;margin:0 0 4px;line-height:1.6;font-weight:700;">The Vaultline Team</p>
  <p style="font-size:13px;color:#8a8aad;margin:0;line-height:1.5;">    <a href="https://vaultline.app" style="color:#0ea5e9;text-decoration:none;">vaultline.app</a>
  </p>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="font-size:12px;color:#8a8aad;line-height:1.5;">
        <a href="https://vaultline.app" style="color:#0ea5e9;text-decoration:none;">vaultline.app</a> &bull; <a href="https://finance-os.app" style="color:#0ea5e9;text-decoration:none;">finance-os.app</a><br>
        <a href="{{unsubscribe_url}}" style="color:#8a8aad;text-decoration:underline;">Unsubscribe</a>
      </td>
    </tr>
  </table>
</td>
</tr>

</table>
</td></tr>
</table>
` }} />
    </>
  );
}
