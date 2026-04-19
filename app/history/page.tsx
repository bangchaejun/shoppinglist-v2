export default function HistoryPage() {
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
    padding: "14px 0",
    borderBottom: "1px solid #374151",
  };

  const badgeStyle = {
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "13px",
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
        <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>구매 히스토리</h1>
        <p style={{ color: "#9ca3af", marginBottom: "28px" }}>
          날짜별 구매 내역과 지출 기록을 확인하는 페이지입니다.
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
            <h2 style={{ marginTop: 0, marginBottom: "10px" }}>총 구매 건수</h2>
            <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>12건</p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: "10px" }}>총 지출</h2>
            <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>₩86,000</p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: "10px" }}>최근 구매일</h2>
            <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>2026-04-19</p>
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={{ marginTop: 0, marginBottom: "16px" }}>최근 구매 내역</h2>

          <div style={itemStyle}>
            <div>
              <div style={{ fontWeight: "bold" }}>우유</div>
              <div style={{ color: "#9ca3af", marginTop: "4px" }}>
                2026-04-19 · 수량 2 · ₩8,000
              </div>
            </div>
            <span style={badgeStyle}>완료</span>
          </div>

          <div style={itemStyle}>
            <div>
              <div style={{ fontWeight: "bold" }}>계란</div>
              <div style={{ color: "#9ca3af", marginTop: "4px" }}>
                2026-04-18 · 수량 1 · ₩6,000
              </div>
            </div>
            <span style={badgeStyle}>완료</span>
          </div>

          <div
            style={{
              ...itemStyle,
              borderBottom: "none",
            }}
          >
            <div>
              <div style={{ fontWeight: "bold" }}>빵</div>
              <div style={{ color: "#9ca3af", marginTop: "4px" }}>
                2026-04-17 · 수량 3 · ₩12,000
              </div>
            </div>
            <span style={badgeStyle}>완료</span>
          </div>
        </div>
      </div>
    </main>
  );
}