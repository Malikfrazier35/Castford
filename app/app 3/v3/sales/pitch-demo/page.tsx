'use client';

import { useEffect } from 'react';

export default function V3SalesPitchDemoPage() {
  

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `` }} />
      <div dangerouslySetInnerHTML={{ __html: `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;">
<tr><td align="center" style="padding:40px 20px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

<!-- Header with urgency accent -->
<tr>
<td style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:32px 40px;text-align:left;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td>
        <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Vaultline</span>
        <span style="font-size:12px;color:rgba(255,255,255,0.5);margin-left:8px;letter-spacing:1px;"></span>
      </td>
      <td style="text-align:right;">
        <span style="display:inline-block;background:rgba(14,165,233,0.2);border:1px solid rgba(14,165,233,0.3);border-radius:20px;padding:6px 14px;font-size:11px;color:#7dd3fc;font-weight:600;letter-spacing:0.5px;">FINAL INVITE</span>
      </td>
    </tr>
  </table>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:40px;">

  <p style="font-size:16px;color:#1a1a2e;margin:0 0 20px;line-height:1.6;">
    {{first_name}},
  </p>

  <p style="font-size:16px;color:#1a1a2e;margin:0 0 20px;line-height:1.6;">
    I'll keep this brief. I've been trying to connect because I believe Vaultline could fundamentally change how {{company_name}} manages treasury operations.
  </p>

  <p style="font-size:16px;color:#1a1a2e;margin:0 0 24px;line-height:1.6;">
    Instead of another email, here's exactly what a demo would cover:
  </p>

  <!-- Offer Card -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;border-radius:12px;overflow:hidden;border:2px solid #0ea5e9;">
    <tr>
      <td style="background:linear-gradient(135deg,#e0f2fe,#f0f9ff);padding:28px 24px;">
        <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:#1a1a2e;letter-spacing:-0.3px;">Your personalized demo includes:</p>

        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
          <tr>
            <td style="vertical-align:top;padding-right:10px;font-size:16px;color:#10b981;">&#10003;</td>
            <td style="font-size:14px;color:#4a4a6a;line-height:1.5;padding-bottom:10px;">Live walkthrough with <strong>your banking structure</strong> mapped to Vaultline's entity model</td>
          </tr>
          <tr>
            <td style="vertical-align:top;padding-right:10px;font-size:16px;color:#10b981;">&#10003;</td>
            <td style="font-size:14px;color:#4a4a6a;line-height:1.5;padding-bottom:10px;">AI-powered <strong>anomaly detection</strong> demo on real-world treasury scenarios</td>
          </tr>
          <tr>
            <td style="vertical-align:top;padding-right:10px;font-size:16px;color:#10b981;">&#10003;</td>
            <td style="font-size:14px;color:#4a4a6a;line-height:1.5;padding-bottom:10px;">Side-by-side: <strong>your current workflow vs. Vaultline</strong> — see the time savings live</td>
          </tr>
          <tr>
            <td style="vertical-align:top;padding-right:10px;font-size:16px;color:#10b981;">&#10003;</td>
            <td style="font-size:14px;color:#4a4a6a;line-height:1.5;">Custom <strong>ROI estimate</strong> based on your account count, entity structure, and team size</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- Time options -->
  <p style="font-size:16px;color:#1a1a2e;margin:0 0 20px;line-height:1.6;">
    Pick whatever works for your schedule:
  </p>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
    <tr>
      <td width="48%" style="padding-right:2%;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;text-align:center;padding:16px;">
              <a href="https://vaultline.app/schedule?duration=15" style="text-decoration:none;">
                <p style="margin:0;font-size:24px;font-weight:800;color:#0ea5e9;">15 min</p>
                <p style="margin:4px 0 0;font-size:12px;color:#8a8aad;">Quick overview</p>
              </a>
            </td>
          </tr>
        </table>
      </td>
      <td width="48%" style="padding-left:2%;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:#e0f2fe;border:2px solid #0ea5e9;border-radius:8px;text-align:center;padding:16px;">
              <a href="https://vaultline.app/schedule?duration=30" style="text-decoration:none;">
                <p style="margin:0;font-size:24px;font-weight:800;color:#0ea5e9;">30 min</p>
                <p style="margin:4px 0 0;font-size:12px;color:#4a4a6a;font-weight:600;">Full deep dive &#9733;</p>
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- Direct CTA -->
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
    <tr>
      <td style="background:linear-gradient(135deg,#0ea5e9,#0284c7);border-radius:8px;text-align:center;">
        <a href="https://vaultline.app/demo" style="display:block;padding:16px 36px;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.3px;">Claim Your Personalized Demo</a>
      </td>
    </tr>
  </table>

  <!-- Soft close -->
  <p style="font-size:16px;color:#1a1a2e;margin:0 0 24px;line-height:1.6;">
    If the timing isn't right, no pressure at all. But if your treasury team is still logging into multiple bank portals every morning to piece together a cash position, this demo will be the most productive 15 minutes of your week.
  </p>

  <!-- PS line -->
  <p style="font-size:14px;color:#6b6b8a;margin:0 0 28px;line-height:1.6;border-top:1px solid #f0f0f5;padding-top:16px;">
    <strong style="color:#1a1a2e;">P.S.</strong> — We're currently offering mid-market treasury teams a complimentary 30-day pilot with full bank connectivity setup and white-glove onboarding. Happy to share details on the call.
  </p>

  <!-- Sign off -->
  <p style="font-size:16px;color:#1a1a2e;margin:0 0 4px;line-height:1.6;">Cheers,</p>
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
