export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#111827",
        color: "#ffffff",
        padding: "24px",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "720px" }}>
        <h1 style={{ fontSize: "42px", fontWeight: "bold", marginBottom: "16px" }}>
          ShoppingList V2
        </h1>
        <p style={{ fontSize: "18px", lineHeight: 1.6, color: "#d1d5db" }}>
          서비스형 쇼핑리스트/장바구니 앱 구축을 시작합니다.
        </p>
        <p style={{ marginTop: "12px", color: "#9ca3af" }}>
          다음 단계: 로그인, 대시보드, 리스트 상세 화면 뼈대 만들기
        </p>
      </div>
    </main>
  );
}