'use client';

import { useEffect } from 'react';

export default function V3SalesPitchColdPage() {
  

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
    When you're managing treasury across multiple entities, banks, and currencies, the margin for error is zero — but the tools most mid-market teams rely on weren't built for that kind of complexity.
  </p>

  <p style="font-size:16px;color:#1a1a2e;margin:0 0 20px;line-height:1.6;">
    Spreadsheets break. Bank portals don't talk to each other. And by the time you've consolidated a cash position, the numbers are already stale.
  </p>

  <p style="font-size:16px;color:#1a1a2e;margin:0 0 24px;line-height:1.6;">
    <strong>Vaultline</strong> is an enterprise treasury management platform that gives your team a single, real-time view of every dollar across every account — without the 6-month implementation cycle.
  </p>

  <!-- 3 Value Props -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
    <tr>
      <td style="padding:16px 20px;background:#f8fafc;border-left:3px solid #0ea5e9;border-radius:0 8px 8px 0;">
        <p style="margin:0;font-size:14px;color:#0ea5e9;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Unified Cash Position</p>
        <p style="margin:6px 0 0;font-size:14px;color:#4a4a6a;line-height:1.5;">Aggregate unlimited bank accounts, entities, and currencies into one live dashboard. See your global cash position in seconds, not hours.</p>
      </td>
    </tr>
    <tr><td style="height:8px;"></td></tr>
    <tr>
      <td style="padding:16px 20px;background:#f8fafc;border-left:3px solid #10b981;border-radius:0 8px 8px 0;">
        <p style="margin:0;font-size:14px;color:#10b981;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Liquidity Forecasting</p>
        <p style="margin:6px 0 0;font-size:14px;color:#4a4a6a;line-height:1.5;">AI-driven 90-day cash forecasts that learn from your payment patterns, receivables, and seasonal trends. Plan with data, not gut feel.</p>
      </td>
    </tr>
    <tr><td style="height:8px;"></td></tr>
    <tr>
      <td style="padding:16px 20px;background:#f8fafc;border-left:3px solid #f59e0b;border-radius:0 8px 8px 0;">
        <p style="margin:0;font-size:14px;color:#f59e0b;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Risk &amp; Compliance Controls</p>
        <p style="margin:6px 0 0;font-size:14px;color:#4a4a6a;line-height:1.5;">Automated counterparty exposure monitoring, policy-based approval workflows, and audit-ready reporting built in from day one.</p>
      </td>
    </tr>
  </table>

  <p style="font-size:16px;color:#1a1a2e;margin:0 0 28px;line-height:1.6;">
    Would it be worth 15 minutes to see how {{company_name}} could get real-time treasury visibility without replacing your existing banking stack?
  </p>

  <!-- CTA -->
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
    <tr>
      <td style="background:linear-gradient(135deg,#0ea5e9,#0284c7);border-radius:8px;text-align:center;">
        <a href="https://vaultline.app/demo" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.3px;">Book a 15-Min Demo</a>
      </td>
    </tr>
  </table>

  <!-- Sign off -->
  <p style="font-size:16px;color:#1a1a2e;margin:0 0 4px;line-height:1.6;">Talk soon,</p>
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
