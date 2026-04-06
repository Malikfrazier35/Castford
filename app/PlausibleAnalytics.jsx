"use client";
import { useEffect } from "react";

export default function PlausibleAnalytics() {
  useEffect(() => {
    async function init() {
      try {
        const { default: Plausible } = await import("plausible-tracker");
        const plausible = Plausible({
          domain: "castford.com",
          trackLocalhost: false,
          apiHost: "https://plausible.io",
        });

        // Auto pageview tracking
        plausible.enableAutoPageviews();

        // Track outbound link clicks
        plausible.enableAutoOutboundTracking();

        // Expose for custom event tracking (e.g. signups, exports)
        window.__plausible = plausible.trackEvent;
      } catch (e) {
        // Analytics should never break the app
        console.debug("Plausible init skipped:", e?.message);
      }
    }
    init();
  }, []);

  return null;
}
