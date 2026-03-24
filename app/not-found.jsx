export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#09090b", color: "#f0f2f5", fontFamily: "'Manrope', system-ui, -apple-system, sans-serif",
      flexDirection: "column", gap: 16, padding: 40,
    }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #60a5fa, #818cf8, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(96,165,250,0.25), inset 0 1px 0 rgba(255,255,255,0.15)" }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="2" width="3.5" height="20" rx="1.5" fill="white" opacity="0.95" />
          <rect x="3" y="2" width="16" height="3.2" rx="1.5" fill="white" opacity="0.95" />
          <rect x="3" y="9.5" width="11" height="2.8" rx="1.2" fill="white" opacity="0.65" />
          <rect x="14" y="14" width="2.8" height="8" rx="1" fill="white" opacity="0.4" />
          <rect x="18" y="10" width="2.8" height="12" rx="1" fill="white" opacity="0.55" />
        </svg>
      </div>
      <h2 style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.03em", opacity: 0.2, margin: 0 }}>404</h2>
      <p style={{ fontSize: 14, color: "#8b92a5", textAlign: "center" }}>
        This page doesn't exist. Let's get you back to your dashboard.
      </p>
      <a href="/" style={{
        fontSize: 14, padding: "12px 24px", borderRadius: 10, textDecoration: "none",
        background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", fontWeight: 700,
        boxShadow: "0 4px 16px rgba(96,165,250,0.25)",
      }}>Back to FinanceOS</a>
    </div>
  );
}
