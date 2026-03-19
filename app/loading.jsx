export default function Loading() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0c0d10",
    }}>
      <div style={{
        width: 36,
        height: 36,
        border: "3px solid rgba(96,165,250,0.2)",
        borderTopColor: "#60a5fa",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
