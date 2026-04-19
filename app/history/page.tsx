"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

type HistoryList = {
  id: string;
  title: string;
  budget: number;
  final_total: number;
  status: string;
  shopping_date: string | null;
  completed_at: string | null;
  created_at: string;
};

export default function HistoryPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState<HistoryList[]>([]);
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
  };

  function formatCurrency(value: number) {
    return `₩${Number(value || 0).toLocaleString("ko-KR")}`;
  }

  useEffect(() => {
    async function loadHistory() {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("shopping_lists")
        .select("*")
        .eq("user_id", userData.user.id)
        .eq("status", "completed")
        .order("completed_at", { ascending: false });

      if (error) {
        setErrorMessage("히스토리 데이터를 불러오지 못했습니다.");
        setLoading(false);
        return;
      }

      setLists((data as HistoryList[]) || []);
      setLoading(false);
    }

    loadHistory();
  }, [router, supabase]);

  const totalCompletedCount = useMemo(() => {
    return lists.length;
  }, [lists]);

  const totalSpentAmount = useMemo(() => {
    return lists.reduce((sum, list) => sum + Number(list.final_total || 0), 0);
  }, [lists]);

  const overBudgetCount = useMemo(() => {
    return lists.filter((list) => Number(list.final_total || 0) > Number(list.budget || 0)).length;
  }, [lists]);

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
        히스토리를 불러오는 중...
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
        <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>구매 히스토리</h1>
        <p style={{ color: "#9ca3af", marginBottom: "28px" }}>
          종료된 장보기 기록과 최종 정산 내역을 확인하는 페이지입니다.
        </p>

        {errorMessage ? (
          <div
            style={{
              ...cardStyle,
              marginBottom: "24px",
              border: "1px solid #7f1d1d",
              background: "#3b0d0d",
            }}
          >
            <p style={{ color: "#fecaca", margin: 0 }}>{errorMessage}</p>
          </div>
        ) : null}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: "10px" }}>완료된 장보기</h2>
            <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>
              {totalCompletedCount}건
            </p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: "10px" }}>총 사용금액</h2>
            <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>
              {formatCurrency(totalSpentAmount)}
            </p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: "10px" }}>예산 초과 건수</h2>
            <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>
              {overBudgetCount}건
            </p>
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={{ marginTop: 0, marginBottom: "16px" }}>장보기 완료 기록</h2>

          {lists.length === 0 ? (
            <p style={{ color: "#9ca3af", margin: 0 }}>
              아직 종료된 장보기 기록이 없습니다.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "16px",
              }}
            >
              {lists.map((list) => {
                const budget = Number(list.budget || 0);
                const finalTotal = Number(list.final_total || 0);
                const difference = budget - finalTotal;
                const isOverBudget = difference < 0;

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
                    <h3 style={{ marginTop: 0, marginBottom: "10px" }}>{list.title}</h3>

                    <p style={{ color: "#d1d5db", marginBottom: "8px" }}>
                      예산: {formatCurrency(budget)}
                    </p>

                    <p style={{ color: "#d1d5db", marginBottom: "8px" }}>
                      최종 사용금액: {formatCurrency(finalTotal)}
                    </p>

                    <p
                      style={{
                        color: isOverBudget ? "#fca5a5" : "#86efac",
                        marginBottom: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      {isOverBudget
                        ? `예산 초과: ${formatCurrency(Math.abs(difference))}`
                        : `예산 잔여: ${formatCurrency(difference)}`}
                    </p>

                    <p style={{ color: "#9ca3af", marginBottom: "6px" }}>
                      쇼핑 날짜: {list.shopping_date || "미지정"}
                    </p>

                    <p style={{ color: "#9ca3af", marginBottom: "6px" }}>
                      완료일시:{" "}
                      {list.completed_at
                        ? new Date(list.completed_at).toLocaleString("ko-KR")
                        : "기록 없음"}
                    </p>

                    <Link href={`/lists/${list.id}`} style={buttonStyle}>
                      상세 보기
                    </Link>
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