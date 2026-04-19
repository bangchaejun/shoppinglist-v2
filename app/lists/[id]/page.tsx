type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ShoppingListDetailPage({ params }: PageProps) {
  const { id } = await params;

  const cardStyle = {
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "16px",
    padding: "20px",
    color: "#ffffff",
  };

  const itemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    borderBottom: "1px solid #374151",
  };

  const badgeStyle = {
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "14px",
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
        <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>쇼핑리스트 상세</h1>
        <p style={{ color: "#d1d5db", marginBottom: "8px" }}>리스트 ID: {id}</p>
        <p style={{ color: "#9ca3af", marginBottom: "28px" }}>
          앞으로 이 화면에서 예산, 항목, 수량, 구매완료 상태를 관리하게 됩니다.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: "10px" }}>예산</h2>
            <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>₩100,000</p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: "10px" }}>총 지출</h2>
            <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>₩32,000</p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: "10px" }}>잔액</h2>
            <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>₩68,000</p>
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={{ marginTop: 0, marginBottom: "16px" }}>쇼핑 항목</h2>

          <div style={itemStyle}>
            <div>
              <div style={{ fontWeight: "bold" }}>우유</div>
              <div style={{ color: "#9ca3af", marginTop: "4px" }}>수량: 2</div>
            </div>
            <span style={badgeStyle}>미구매</span>
          </div>

          <div style={itemStyle}>
            <div>
              <div style={{ fontWeight: "bold" }}>계란</div>
              <div style={{ color: "#9ca3af", marginTop: "4px" }}>수량: 1</div>
            </div>
            <span style={badgeStyle}>미구매</span>
          </div>

          <div
            style={{
              ...itemStyle,
              borderBottom: "none",
            }}
          >
            <div>
              <div style={{ fontWeight: "bold" }}>빵</div>
              <div style={{ color: "#9ca3af", marginTop: "4px" }}>수량: 3</div>
            </div>
            <span style={badgeStyle}>구매완료</span>
          </div>
        </div>
      </div>
    </main>
  );
}