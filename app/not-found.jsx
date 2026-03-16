export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#09090b", color: "#f0f2f5", fontFamily: "system-ui, -apple-system, sans-serif",
      flexDirection: "column", gap: 16, padding: 40,
    }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #38bdf8, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: "#fff" }}>F</div>
      <h2 style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.03em", opacity: 0.2 }}>404</h2>
      <p style={{ fontSize: 14, color: "#6b7280", textAlign: "center" }}>
        This page doesn't exist.
      </p>
      <a href="/" style={{
        fontSize: 14, padding: "12px 24px", borderRadius: 10, textDecoration: "none",
        background: "linear-gradient(135deg, #38bdf8, #a78bfa)", color: "#fff", fontWeight: 700,
        boxShadow: "0 4px 16px rgba(56,189,248,0.25)",
      }}>Back to FinanceOS</a>
    </div>
  );
}
