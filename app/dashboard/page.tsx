export default function DashboardPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#111827",
        color: "#ffffff",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "36px", marginBottom: "12px" }}>대시보드 페이지</h1>
        <p style={{ color: "#d1d5db" }}>여기에 내 쇼핑리스트 목록이 들어갑니다.</p>
      </div>
    </main>
  );
}