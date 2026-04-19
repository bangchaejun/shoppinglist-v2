"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, FormEvent } from "react";
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
  status: string;
  final_total: number;
  completed_at: string | null;
  created_at: string;
};

type FilterType = "all" | "active" | "completed";

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingListId, setDeletingListId] = useState<string | null>(null);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [updatingListId, setUpdatingListId] = useState<string | null>(null);

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");

  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [shoppingDate, setShoppingDate] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editBudget, setEditBudget] = useState("");
  const [editShoppingDate, setEditShoppingDate] = useState("");

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

  const dangerButtonStyle = {
    display: "inline-block",
    marginTop: "12px",
    padding: "10px 16px",
    borderRadius: "10px",
    background: "#dc2626",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
  };

  const secondaryButtonStyle = {
    display: "inline-block",
    marginTop: "12px",
    padding: "10px 16px",
    borderRadius: "10px",
    background: "#374151",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
  };

  const filterButtonBaseStyle = {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "1px solid #374151",
    background: "#111827",
    color: "#ffffff",
    fontWeight: "bold",
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

  function formatCurrency(value: number) {
    return `₩${Number(value || 0).toLocaleString("ko-KR")}`;
  }

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

  const activeCount = useMemo(() => {
    return lists.filter((list) => list.status !== "completed").length;
  }, [lists]);

  const completedCount = useMemo(() => {
    return lists.filter((list) => list.status === "completed").length;
  }, [lists]);

  const filteredLists = useMemo(() => {
    if (filter === "active") {
      return lists.filter((list) => list.status !== "completed");
    }

    if (filter === "completed") {
      return lists.filter((list) => list.status === "completed");
    }

    return lists;
  }, [lists, filter]);

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
          status: "active",
          final_total: 0,
        })
        .select()
        .single();

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      const newList = data as ShoppingList;

      setMessage("쇼핑리스트가 생성되었습니다.");
      setLists((prev) => [newList, ...prev]);
      setFilter("all");

      setTitle("");
      setBudget("");
      setShoppingDate("");
    } catch {
      setErrorMessage("리스트 생성 중 오류가 발생했습니다.");
    } finally {
      setCreating(false);
    }
  }

  function handleStartEdit(list: ShoppingList) {
    setMessage("");
    setErrorMessage("");
    setEditingListId(list.id);
    setEditTitle(list.title);
    setEditBudget(String(Number(list.budget || 0)));
    setEditShoppingDate(list.shopping_date || "");
  }

  function handleCancelEdit() {
    setEditingListId(null);
    setEditTitle("");
    setEditBudget("");
    setEditShoppingDate("");
  }

  async function handleUpdateList(e: FormEvent<HTMLFormElement>, listId: string) {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!editTitle.trim()) {
      setErrorMessage("리스트 제목을 입력해주세요.");
      return;
    }

    const parsedBudget = editBudget.trim() === "" ? 0 : Number(editBudget);

    if (Number.isNaN(parsedBudget) || parsedBudget < 0) {
      setErrorMessage("예산은 0 이상의 숫자로 입력해주세요.");
      return;
    }

    try {
      setUpdatingListId(listId);

      const { data, error } = await supabase
        .from("shopping_lists")
        .update({
          title: editTitle.trim(),
          budget: parsedBudget,
          shopping_date: editShoppingDate || null,
        })
        .eq("id", listId)
        .select()
        .single();

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      const updatedList = data as ShoppingList;

      setLists((prev) =>
        prev.map((list) => (list.id === listId ? updatedList : list))
      );

      setMessage(`"${updatedList.title}" 리스트가 수정되었습니다.`);
      handleCancelEdit();
    } catch {
      setErrorMessage("리스트 수정 중 오류가 발생했습니다.");
    } finally {
      setUpdatingListId(null);
    }
  }

  async function handleDeleteList(list: ShoppingList) {
    setMessage("");
    setErrorMessage("");

    const confirmed = window.confirm(`"${list.title}" 리스트를 삭제할까요?`);
    if (!confirmed) return;

    try {
      setDeletingListId(list.id);

      const { error } = await supabase
        .from("shopping_lists")
        .delete()
        .eq("id", list.id);

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setLists((prev) => prev.filter((prevList) => prevList.id !== list.id));
      setMessage(`"${list.title}" 리스트가 삭제되었습니다.`);
    } catch {
      setErrorMessage("리스트 삭제 중 오류가 발생했습니다.");
    } finally {
      setDeletingListId(null);
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
              쇼핑리스트를 만들고 상태별로 관리하는 메인 화면입니다.
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
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: "10px" }}>전체 리스트</h2>
            <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>{lists.length}개</p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: "10px" }}>진행중</h2>
            <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>{activeCount}개</p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: "10px" }}>종료됨</h2>
            <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>
              {completedCount}개
            </p>
          </div>
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "16px",
            }}
          >
            <h2 style={{ margin: 0 }}>내 쇼핑리스트</h2>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => setFilter("all")}
                style={{
                  ...filterButtonBaseStyle,
                  background: filter === "all" ? "#2563eb" : "#111827",
                }}
              >
                전체
              </button>

              <button
                type="button"
                onClick={() => setFilter("active")}
                style={{
                  ...filterButtonBaseStyle,
                  background: filter === "active" ? "#2563eb" : "#111827",
                }}
              >
                진행중
              </button>

              <button
                type="button"
                onClick={() => setFilter("completed")}
                style={{
                  ...filterButtonBaseStyle,
                  background: filter === "completed" ? "#2563eb" : "#111827",
                }}
              >
                종료됨
              </button>
            </div>
          </div>

          {filteredLists.length === 0 ? (
            <p style={{ color: "#9ca3af", margin: 0 }}>
              {filter === "all"
                ? "아직 생성된 쇼핑리스트가 없습니다."
                : filter === "active"
                ? "진행중인 리스트가 없습니다."
                : "종료된 리스트가 없습니다."}
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "16px",
              }}
            >
              {filteredLists.map((list) => {
                const isCompleted = list.status === "completed";
                const isEditing = editingListId === list.id;

                return (
                  <div
                    key={list.id}
                    style={{
                      background: "#111827",
                      border: "1px solid #374151",
                      borderRadius: "14px",
                      padding: "18px",
                    }}
                  >
                    {!isEditing ? (
                      <>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "10px",
                            alignItems: "flex-start",
                            marginBottom: "10px",
                          }}
                        >
                          <h3 style={{ marginTop: 0, marginBottom: 0 }}>{list.title}</h3>

                          <span
                            style={{
                              padding: "6px 10px",
                              borderRadius: "999px",
                              background: isCompleted ? "#16a34a" : "#2563eb",
                              fontSize: "12px",
                              fontWeight: "bold",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {isCompleted ? "종료됨" : "진행중"}
                          </span>
                        </div>

                        <p style={{ color: "#d1d5db", marginBottom: "8px" }}>
                          예산: {formatCurrency(Number(list.budget))}
                        </p>

                        <p style={{ color: "#9ca3af", marginBottom: "8px" }}>
                          쇼핑 날짜: {list.shopping_date || "미지정"}
                        </p>

                        {isCompleted ? (
                          <p style={{ color: "#86efac", marginBottom: "8px" }}>
                            최종 금액: {formatCurrency(Number(list.final_total || 0))}
                          </p>
                        ) : null}

                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                            marginTop: "14px",
                          }}
                        >
                          <Link href={`/lists/${list.id}`} style={buttonStyle}>
                            리스트 열기
                          </Link>

                          <button
                            type="button"
                            style={secondaryButtonStyle}
                            onClick={() => handleStartEdit(list)}
                          >
                            리스트 수정
                          </button>

                          <button
                            type="button"
                            style={dangerButtonStyle}
                            onClick={() => handleDeleteList(list)}
                            disabled={deletingListId === list.id}
                          >
                            {deletingListId === list.id ? "삭제 중..." : "리스트 삭제"}
                          </button>
                        </div>
                      </>
                    ) : (
                      <form onSubmit={(e) => handleUpdateList(e, list.id)}>
                        <h3 style={{ marginTop: 0, marginBottom: "16px" }}>리스트 수정</h3>

                        <div style={{ marginBottom: "12px" }}>
                          <label
                            style={{
                              display: "block",
                              marginBottom: "8px",
                              fontWeight: "bold",
                            }}
                          >
                            제목
                          </label>
                          <input
                            type="text"
                            style={inputStyle}
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />
                        </div>

                        <div style={{ marginBottom: "12px" }}>
                          <label
                            style={{
                              display: "block",
                              marginBottom: "8px",
                              fontWeight: "bold",
                            }}
                          >
                            예산
                          </label>
                          <input
                            type="number"
                            style={inputStyle}
                            value={editBudget}
                            onChange={(e) => setEditBudget(e.target.value)}
                          />
                        </div>

                        <div style={{ marginBottom: "12px" }}>
                          <label
                            style={{
                              display: "block",
                              marginBottom: "8px",
                              fontWeight: "bold",
                            }}
                          >
                            쇼핑 날짜
                          </label>
                          <input
                            type="date"
                            style={inputStyle}
                            value={editShoppingDate}
                            onChange={(e) => setEditShoppingDate(e.target.value)}
                          />
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                            marginTop: "14px",
                          }}
                        >
                          <button
                            type="submit"
                            style={buttonStyle}
                            disabled={updatingListId === list.id}
                          >
                            {updatingListId === list.id ? "저장 중..." : "저장"}
                          </button>

                          <button
                            type="button"
                            style={secondaryButtonStyle}
                            onClick={handleCancelEdit}
                            disabled={updatingListId === list.id}
                          >
                            취소
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}