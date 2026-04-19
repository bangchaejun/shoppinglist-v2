export default function SettingsPage() {
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
        <h1 style={{ fontSize: "36px", marginBottom: "12px" }}>설정 페이지</h1>
        <p style={{ color: "#d1d5db" }}>여기에 프로필, 다크모드, 로그아웃 기능이 들어갑니다.</p>
      </div>
    </main>
  );
}