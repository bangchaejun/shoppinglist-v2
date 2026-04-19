import Link from "next/link";

export default function LoginPage() {
  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1px solid #374151",
    background: "#111827",
    color: "#ffffff",
    fontSize: "16px",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
    color: "#e5e7eb",
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
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
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#1f2937",
          border: "1px solid #374151",
          borderRadius: "16px",
          padding: "28px",
        }}
      >
        <h1 style={{ fontSize: "32px", marginTop: 0, marginBottom: "10px" }}>로그인</h1>
        <p style={{ color: "#9ca3af", marginBottom: "24px" }}>
          이메일과 비밀번호를 입력해 로그인합니다.
        </p>

        <div style={{ marginBottom: "18px" }}>
          <label style={labelStyle}>이메일</label>
          <input type="email" placeholder="example@email.com" style={inputStyle} />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>비밀번호</label>
          <input type="password" placeholder="비밀번호를 입력하세요" style={inputStyle} />
        </div>

        <button style={buttonStyle}>로그인</button>

        <p style={{ marginTop: "20px", color: "#9ca3af", textAlign: "center" }}>
          아직 계정이 없으신가요?{" "}
          <Link href="/signup" style={{ color: "#60a5fa", textDecoration: "none" }}>
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}