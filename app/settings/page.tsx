export default function SettingsPage() {
  const cardStyle = {
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "16px",
    padding: "20px",
    color: "#ffffff",
  };

  const buttonStyle = {
    marginTop: "12px",
    padding: "10px 16px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
  };

  return (
    <main
      style={{
        minHeight: "calc(100vh - 73px)",
        background: "#111827",
        color: "#ffffff",
        padding: "32px 20px",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>설정</h1>
        <p style={{ color: "#9ca3af", marginBottom: "28px" }}>
          계정과 앱 환경을 관리하는 페이지입니다.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>프로필</h2>
            <p style={{ color: "#d1d5db" }}>
              이름, 이메일, 계정 정보를 확인하는 영역입니다.
            </p>
            <button style={buttonStyle}>프로필 수정</button>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>테마 설정</h2>
            <p style={{ color: "#d1d5db" }}>
              다크모드, 화면 스타일 같은 설정이 들어갈 예정입니다.
            </p>
            <button style={buttonStyle}>테마 변경</button>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>로그아웃</h2>
            <p style={{ color: "#d1d5db" }}>
              로그인 기능 연결 후 여기서 로그아웃을 처리하게 됩니다.
            </p>
            <button style={buttonStyle}>로그아웃</button>
          </div>
        </div>
      </div>
    </main>
  );
}