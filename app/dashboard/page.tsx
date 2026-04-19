import Link from "next/link";

export default function DashboardPage() {
  const cardStyle = {
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "16px",
    padding: "20px",
    color: "#ffffff",
  };

  const buttonStyle = {
    display: "inline-block",
    marginTop: "12px",
    padding: "10px 16px",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "bold",
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
        <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>대시보드</h1>
        <p style={{ color: "#d1d5db", marginBottom: "28px" }}>
          내 쇼핑리스트와 주요 기능을 한눈에 보는 페이지입니다.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>내 쇼핑리스트</h2>
            <p style={{ color: "#d1d5db" }}>
              앞으로 이곳에 내가 만든 쇼핑리스트 목록이 표시됩니다.
            </p>
            <Link href="/lists/test123" style={buttonStyle}>
              예시 리스트 보기
            </Link>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>구매 히스토리</h2>
            <p style={{ color: "#d1d5db" }}>
              구매한 항목과 지출 기록을 확인할 수 있습니다.
            </p>
            <Link href="/history" style={buttonStyle}>
              히스토리 보기
            </Link>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>설정</h2>
            <p style={{ color: "#d1d5db" }}>
              프로필, 로그아웃, 환경설정 기능이 들어갈 예정입니다.
            </p>
            <Link href="/settings" style={buttonStyle}>
              설정 가기
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}