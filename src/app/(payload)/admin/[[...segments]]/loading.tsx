export default function AdminLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        background: "#0c0c0c",
        color: "rgba(255,255,255,0.85)",
        fontFamily: "system-ui, sans-serif",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          border: "3px solid rgba(255,255,255,0.2)",
          borderTopColor: "#ff5c00",
          borderRadius: "50%",
          animation: "admin-spin 0.85s linear infinite",
        }}
      />
      <p style={{ margin: 0, fontSize: 15, maxWidth: 360, lineHeight: 1.45 }}>
        Загрузка админки… Первый раз после старта сервера Turbopack может компилировать бандл{" "}
        <strong>30–60 секунд</strong> — это нормально, подожди.
      </p>
      <style>{"@keyframes admin-spin { to { transform: rotate(360deg); } }"}</style>
    </div>
  );
}
