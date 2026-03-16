"use client";

export default function Error({ error, reset }) {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#09090b", color: "#f0f2f5", fontFamily: "system-ui, -apple-system, sans-serif",
      flexDirection: "column", gap: 16, padding: 40,
    }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #38bdf8, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: "#fff" }}>F</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>Something went wrong</h2>
      <p style={{ fontSize: 14, color: "#6b7280", maxWidth: 400, textAlign: "center", lineHeight: 1.6 }}>
        FinanceOS encountered an unexpected error. Your data is safe. Click below to reload.
      </p>
      <button
        onClick={() => reset()}
        style={{
          fontSize: 14, padding: "12px 24px", borderRadius: 10, border: "none", cursor: "pointer",
          background: "linear-gradient(135deg, #38bdf8, #a78bfa)", color: "#fff", fontWeight: 700,
          fontFamily: "inherit", boxShadow: "0 4px 16px rgba(56,189,248,0.25)",
        }}
      >
        Try Again
      </button>
    </div>
  );
}
