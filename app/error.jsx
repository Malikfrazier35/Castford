"use client";

export default function Error({ error, reset }) {
  const clearAndReload = () => {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith("fos_")) localStorage.removeItem(key);
      });
    } catch {}
    window.location.href = "/";
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#09090b", color: "#f0f2f5", fontFamily: "'Manrope', system-ui, -apple-system, sans-serif",
      flexDirection: "column", gap: 20, padding: 40,
    }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #60a5fa, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: "#fff" }}>F</div>
      <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>Something went wrong</h2>
      <p style={{ fontSize: 14, color: "#8b92a5", maxWidth: 440, textAlign: "center", lineHeight: 1.7, margin: 0 }}>
        FinanceOS hit an unexpected error. Your financial data is safe and encrypted. Try one of the options below to get back to your dashboard.
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => reset()} style={{
          fontSize: 14, padding: "12px 24px", borderRadius: 10, border: "none", cursor: "pointer",
          background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", fontWeight: 700,
          fontFamily: "inherit", boxShadow: "0 4px 16px rgba(96,165,250,0.25)",
        }}>Try Again</button>
        <button onClick={clearAndReload} style={{
          fontSize: 14, padding: "12px 24px", borderRadius: 10, cursor: "pointer",
          border: "1px solid #1e2230", background: "transparent", color: "#9ea5b8", fontWeight: 600,
          fontFamily: "inherit",
        }}>Clear Cache &amp; Reload</button>
      </div>
      <p style={{ fontSize: 11, color: "#3d4558", maxWidth: 400, textAlign: "center", lineHeight: 1.5, margin: 0 }}>
        If this keeps happening, clear your browser cache or try an incognito window. Contact support at support@finance-os.app.
      </p>
    </div>
  );
}
