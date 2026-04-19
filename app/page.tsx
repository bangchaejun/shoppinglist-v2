import Link from "next/link";

export default function HomePage() {
  const linkStyle = {
    display: "inline-block",
    padding: "12px 20px",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "bold",
    minWidth: "140px",
    textAlign: "center" as const,
  };

  return (
    <main
      style={{
        minHeight: "calc(100vh - 73px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#111827",
        color: "#ffffff",
        padding: "24px",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "900px" }}>
        <h1 style={{ fontSize: "42px", fontWeight: "bold", marginBottom: "16px" }}>
          ShoppingList V2
        </h1>

        <p style={{ fontSize: "18px", lineHeight: 1.6, color: "#d1d5db", marginBottom: "12px" }}>
          서비스형 쇼핑리스트/장바구니 앱 구축을 시작합니다.
        </p>

        <p style={{ marginBottom: "32px", color: "#9ca3af" }}>
          아래 버튼으로 각 페이지를 바로 확인할 수 있습니다.
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link href="/login" style={linkStyle}>
            로그인
          </Link>

          <Link href="/signup" style={linkStyle}>
            회원가입
          </Link>

          <Link href="/dashboard" style={linkStyle}>
            대시보드
          </Link>

          <Link href="/history" style={linkStyle}>
            히스토리
          </Link>

          <Link href="/settings" style={linkStyle}>
            설정
          </Link>

          <Link href="/lists/test123" style={linkStyle}>
            리스트 상세
          </Link>
        </div>
      </div>
    </main>
  );
}