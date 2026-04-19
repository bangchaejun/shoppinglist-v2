"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setMessage("로그인 성공. 대시보드로 이동합니다.");
      router.push("/dashboard");
    } catch (error) {
      setErrorMessage("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>이메일</label>
            <input
              type="email"
              placeholder="example@email.com"
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {message ? (
            <p style={{ color: "#86efac", marginBottom: "16px" }}>{message}</p>
          ) : null}

          {errorMessage ? (
            <p style={{ color: "#fca5a5", marginBottom: "16px" }}>{errorMessage}</p>
          ) : null}

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "로그인 처리중..." : "로그인"}
          </button>
        </form>

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