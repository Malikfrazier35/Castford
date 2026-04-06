import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Castford — AI-Powered FP&A Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0b0f 0%, #111827 50%, #0f172a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Ambient glow orbs */}
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "60%", height: "60%", borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: "-15%", left: "-5%", width: "45%", height: "45%", borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)", display: "flex" }} />

        {/* Top accent line */}
        <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 3, background: "linear-gradient(90deg, transparent, #60a5fa60, #a78bfa60, transparent)", borderRadius: 2, display: "flex" }} />

        {/* Logo mark */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 72, height: 72, borderRadius: 18,
          background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
          boxShadow: "0 8px 32px rgba(96,165,250,0.3)",
          marginBottom: 32, fontSize: 32, fontWeight: 800, color: "#fff",
        }}>
          F
        </div>

        {/* Title */}
        <div style={{
          fontSize: 52, fontWeight: 800, color: "#f0f2f5",
          letterSpacing: "-0.03em", marginBottom: 8,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          Finance<span style={{ fontWeight: 400, opacity: 0.6 }}>OS</span>
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: 22, color: "#8b92a5", fontWeight: 500,
          marginBottom: 36, letterSpacing: "-0.01em",
        }}>
          AI-Powered Financial Planning & Analysis
        </div>

        {/* Key metrics row */}
        <div style={{
          display: "flex", gap: 48, padding: "20px 48px",
          borderRadius: 16, border: "1px solid rgba(96,165,250,0.15)",
          background: "rgba(96,165,250,0.04)",
        }}>
          {[
            { value: "30+", label: "Integrations" },
            { value: "<48hr", label: "Implementation" },
            { value: "$499/mo", label: "Starting Price" },
            { value: "SOC 2", label: "Compliant" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#60a5fa", letterSpacing: "-0.02em" }}>{item.value}</div>
              <div style={{ fontSize: 13, color: "#636d84", fontWeight: 500, marginTop: 2 }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Bottom URL */}
        <div style={{
          position: "absolute", bottom: 32,
          fontSize: 14, color: "#3d4558", fontWeight: 600,
          letterSpacing: "0.04em",
        }}>
          castford.com
        </div>
      </div>
    ),
    { ...size }
  );
}
