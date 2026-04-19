"use client";

import Link from "next/link";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

type UserInfo = {
  id: string;
  email: string;
  name: string;
};

type ShoppingList = {
  id: string;
  title: string;
  budget: number;
  shopping_date: string | null;
  created_at: string;
};

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [lists, setLists] = useState<ShoppingList[]>([]);

  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [shoppingDate, setShoppingDate] = useState("");

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
    border: "none",
    cursor: "pointer",
  };

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

  async function fetchLists(userId: string) {
    const { data, error } = await supabase
      .from("shopping_lists")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setLists((data as ShoppingList[]) || []);
  }

  useEffect(() => {
    async function loadUserAndLists() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.push("/login");
        return;
      }

      const user = data.user;

      setUserInfo({
        id: user.id,
        email: user.email ?? "",
        name: (user.user_metadata?.name as string) ?? "사용자",
      });

      await fetchLists(user.id);
      setLoading(false);
    }

    loadUserAndLists();
  }, [router, supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function handleCreateList(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!userInfo) {
      setErrorMessage("로그인 정보를 확인할 수 없습니다.");
      return;
    }

    if (!title.trim()) {
      setErrorMessage("리스트 제목을 입력해주세요.");
      return;
    }

    const parsedBudget = budget.trim() === "" ? 0 : Number(budget);

    if (Number.isNaN(parsedBudget) || parsedBudget < 0) {
      setErrorMessage("예산은 0 이상의 숫자로 입력해주세요.");
      return;
    }

    try {
      setCreating(true);

      const { data, error } = await supabase
        .from("shopping_lists")
        .insert({
          user_id: userInfo.id,
          title: title.trim(),
          budget: parsedBudget,
          shopping_date: shoppingDate || null,
        })
        .select()
        .single();

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setMessage("쇼핑리스트가 생성되었습니다.");
      setLists((prev) => [data as ShoppingList, ...prev]);

      setTitle("");
      setBudget("");
      setShoppingDate("");
    } catch (error) {
      setErrorMessage("리스트 생성 중 오류가 발생했습니다.");
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "calc(100vh - 73px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111827",
          color: "#ffffff",
        }}
      >
        로그인 정보를 불러오는 중...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "calc(100vh - 73px)",
        background: "#111827",
        color: "#ffffff",
        padding: "32px 20px",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "24px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>대시보드</h1>
            <p style={{ color: "#d1d5db", margin: 0 }}>
              쇼핑리스트를 만들고 관리하는 메인 화면입니다.
            </p>
          </div>

          <button onClick={handleLogout} style={buttonStyle}>
            로그아웃
          </button>
        </div>

        <div
          style={{
            ...cardStyle,
            marginBottom: "20px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>현재 로그인 사용자</h2>
          <p style={{ color: "#d1d5db", marginBottom: "8px" }}>
            이름: <strong style={{ color: "#ffffff" }}>{userInfo?.name}</strong>
          </p>
          <p style={{ color: "#d1d5db", margin: 0 }}>
            이메일: <strong style={{ color: "#ffffff" }}>{userInfo?.email}</strong>
          </p>
        </div>

        <div
          style={{
            ...cardStyle,
            marginBottom: "24px",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "16px" }}>새 쇼핑리스트 만들기</h2>

          <form onSubmit={handleCreateList}>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                리스트 제목
              </label>
              <input
                type="text"
                placeholder="예: 주말 장보기"
                style={inputStyle}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                예산
              </label>
              <input
                type="number"
                placeholder="예: 50000"
                style={inputStyle}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                쇼핑 날짜
              </label>
              <input
                type="date"
                style={inputStyle}
                value={shoppingDate}
                onChange={(e) => setShoppingDate(e.target.value)}
              />
            </div>

            {message ? (
              <p style={{ color: "#86efac", marginBottom: "12px" }}>{message}</p>
            ) : null}

            {errorMessage ? (
              <p style={{ color: "#fca5a5", marginBottom: "12px" }}>{errorMessage}</p>
            ) : null}

            <button type="submit" style={buttonStyle} disabled={creating}>
              {creating ? "생성 중..." : "리스트 생성"}
            </button>
          </form>
        </div>

        <div style={cardStyle}>
          <h2 style={{ marginTop: 0, marginBottom: "16px" }}>내 쇼핑리스트</h2>

          {lists.length === 0 ? (
            <p style={{ color: "#9ca3af", margin: 0 }}>
              아직 생성된 쇼핑리스트가 없습니다.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "16px",
              }}
            >
              {lists.map((list) => (
                <div
                  key={list.id}
                  style={{
                    background: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "14px",
                    padding: "18px",
                  }}
                >
                  <h3 style={{ marginTop: 0, marginBottom: "10px" }}>{list.title}</h3>

                  <p style={{ color: "#d1d5db", marginBottom: "8px" }}>
                    예산: ₩{Number(list.budget).toLocaleString("ko-KR")}
                  </p>

                  <p style={{ color: "#9ca3af", marginBottom: "14px" }}>
                    쇼핑 날짜: {list.shopping_date || "미지정"}
                  </p>

                  <Link href={`/lists/${list.id}`} style={buttonStyle}>
                    리스트 열기
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}