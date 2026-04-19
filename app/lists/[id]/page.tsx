"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";

type ShoppingList = {
  id: string;
  user_id: string;
  title: string;
  budget: number;
  shopping_date: string | null;
  created_at: string;
};

type ShoppingItem = {
  id: string;
  list_id: string;
  name: string;
  planned_quantity: number;
  actual_quantity: number;
  unit_price: number;
  total_price: number;
  is_in_cart: boolean;
  is_purchased: boolean;
  added_in_store: boolean;
  created_at: string;
};

type ItemEditState = {
  actual_quantity: string;
  unit_price: string;
};

export default function ShoppingListDetailPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();

  const listId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [savingItemId, setSavingItemId] = useState<string | null>(null);

  const [list, setList] = useState<ShoppingList | null>(null);
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [itemEdits, setItemEdits] = useState<Record<string, ItemEditState>>({});

  const [itemName, setItemName] = useState("");
  const [plannedQuantity, setPlannedQuantity] = useState("1");
  const [addedInStore, setAddedInStore] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const cardStyle = {
    background: "#1f2937",
    border: "1px solid #374151",
    borderRadius: "16px",
    padding: "20px",
    color: "#ffffff",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #374151",
    background: "#111827",
    color: "#ffffff",
    fontSize: "15px",
    boxSizing: "border-box" as const,
  };

  const primaryButtonStyle = {
    display: "inline-block",
    padding: "10px 16px",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
  };

  const secondaryButtonStyle = {
    display: "inline-block",
    padding: "10px 16px",
    borderRadius: "10px",
    background: "#374151",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
  };

  function formatCurrency(value: number) {
    return `₩${Number(value || 0).toLocaleString("ko-KR")}`;
  }

  async function loadData() {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      router.push("/login");
      return;
    }

    const { data: listData, error: listError } = await supabase
      .from("shopping_lists")
      .select("*")
      .eq("id", listId)
      .eq("user_id", userData.user.id)
      .single();

    if (listError) {
      setErrorMessage("리스트를 불러오지 못했습니다.");
      setLoading(false);
      return;
    }

    const { data: itemData, error: itemError } = await supabase
      .from("shopping_items")
      .select("*")
      .eq("list_id", listId)
      .order("created_at", { ascending: false });

    if (itemError) {
      setErrorMessage("쇼핑 항목을 불러오지 못했습니다.");
      setLoading(false);
      return;
    }

    const loadedItems = (itemData as ShoppingItem[]) || [];

    const initialEdits: Record<string, ItemEditState> = {};
    loadedItems.forEach((item) => {
      initialEdits[item.id] = {
        actual_quantity: String(item.actual_quantity || 0),
        unit_price: String(item.unit_price || 0),
      };
    });

    setList(listData as ShoppingList);
    setItems(loadedItems);
    setItemEdits(initialEdits);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [listId]);

  const currentCartTotal = useMemo(() => {
    return items
      .filter((item) => item.is_in_cart)
      .reduce((sum, item) => sum + Number(item.total_price || 0), 0);
  }, [items]);

  const remainingBudget = Number(list?.budget || 0) - currentCartTotal;

  async function handleCreateItem(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!itemName.trim()) {
      setErrorMessage("항목 이름을 입력해주세요.");
      return;
    }

    const parsedPlannedQuantity = Number(plannedQuantity);

    if (Number.isNaN(parsedPlannedQuantity) || parsedPlannedQuantity < 1) {
      setErrorMessage("예정 수량은 1 이상의 숫자로 입력해주세요.");
      return;
    }

    try {
      setCreating(true);

      const { data, error } = await supabase
        .from("shopping_items")
        .insert({
          list_id: listId,
          name: itemName.trim(),
          planned_quantity: parsedPlannedQuantity,
          actual_quantity: 0,
          unit_price: 0,
          total_price: 0,
          is_in_cart: false,
          is_purchased: false,
          added_in_store: addedInStore,
        })
        .select()
        .single();

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      const newItem = data as ShoppingItem;

      setItems((prev) => [newItem, ...prev]);
      setItemEdits((prev) => ({
        ...prev,
        [newItem.id]: {
          actual_quantity: "0",
          unit_price: "0",
        },
      }));

      setItemName("");
      setPlannedQuantity("1");
      setAddedInStore(false);
      setMessage("쇼핑 항목이 추가되었습니다.");
    } catch (error) {
      setErrorMessage("항목 추가 중 오류가 발생했습니다.");
    } finally {
      setCreating(false);
    }
  }

  function handleEditChange(
    itemId: string,
    field: "actual_quantity" | "unit_price",
    value: string
  ) {
    setItemEdits((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  }

  async function handleAddToCart(item: ShoppingItem) {
    setMessage("");
    setErrorMessage("");

    const currentEdit = itemEdits[item.id];

    const parsedActualQuantity = Number(currentEdit?.actual_quantity ?? 0);
    const parsedUnitPrice = Number(currentEdit?.unit_price ?? 0);

    if (Number.isNaN(parsedActualQuantity) || parsedActualQuantity < 1) {
      setErrorMessage("실제 수량은 1 이상의 숫자로 입력해주세요.");
      return;
    }

    if (Number.isNaN(parsedUnitPrice) || parsedUnitPrice < 0) {
      setErrorMessage("가격은 0 이상의 숫자로 입력해주세요.");
      return;
    }

    const calculatedTotalPrice = parsedActualQuantity * parsedUnitPrice;

    try {
      setSavingItemId(item.id);

      const { data, error } = await supabase
        .from("shopping_items")
        .update({
          actual_quantity: parsedActualQuantity,
          unit_price: parsedUnitPrice,
          total_price: calculatedTotalPrice,
          is_in_cart: true,
        })
        .eq("id", item.id)
        .select()
        .single();

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setItems((prev) =>
        prev.map((prevItem) =>
          prevItem.id === item.id ? (data as ShoppingItem) : prevItem
        )
      );

      setMessage(`"${item.name}" 항목이 카트에 반영되었습니다.`);
    } catch (error) {
      setErrorMessage("카트 반영 중 오류가 발생했습니다.");
    } finally {
      setSavingItemId(null);
    }
  }

  async function handleRemoveFromCart(item: ShoppingItem) {
    setMessage("");
    setErrorMessage("");

    try {
      setSavingItemId(item.id);

      const { data, error } = await supabase
        .from("shopping_items")
        .update({
          is_in_cart: false,
        })
        .eq("id", item.id)
        .select()
        .single();

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setItems((prev) =>
        prev.map((prevItem) =>
          prevItem.id === item.id ? (data as ShoppingItem) : prevItem
        )
      );

      setMessage(`"${item.name}" 항목을 카트에서 해제했습니다.`);
    } catch (error) {
      setErrorMessage("카트 해제 중 오류가 발생했습니다.");
    } finally {
      setSavingItemId(null);
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
        리스트 정보를 불러오는 중...
      </main>
    );
  }

  if (!list) {
    return (
      <main
        style={{
          minHeight: "calc(100vh - 73px)",
          background: "#111827",
          color: "#ffffff",
          padding: "32px 20px",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "32px", marginBottom: "12px" }}>리스트 상세</h1>
          <p style={{ color: "#fca5a5" }}>
            {errorMessage || "리스트를 찾을 수 없습니다."}
          </p>
        </div>
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
        <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>{list.title}</h1>
        <p style={{ color: "#9ca3af", marginBottom: "28px" }}>
          집에서는 살 물건을 저장하고, 마트에서는 실제 수량과 가격을 입력해 카트 금액을 관리합니다.
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
            <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>
              {formatCurrency(Number(list.budget))}
            </p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: "10px" }}>현재 카트 총액</h2>
            <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>
              {formatCurrency(currentCartTotal)}
            </p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: "10px" }}>남은 예산</h2>
            <p
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                margin: 0,
                color: remainingBudget < 0 ? "#f87171" : "#ffffff",
              }}
            >
              {formatCurrency(remainingBudget)}
            </p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, marginBottom: "10px" }}>쇼핑 날짜</h2>
            <p style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>
              {list.shopping_date || "미지정"}
            </p>
          </div>
        </div>

        <div
          style={{
            ...cardStyle,
            marginBottom: "24px",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "16px" }}>새 항목 추가</h2>

          <form onSubmit={handleCreateItem}>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                항목 이름
              </label>
              <input
                type="text"
                placeholder="예: 우유"
                style={inputStyle}
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                예정 수량
              </label>
              <input
                type="number"
                min="1"
                style={inputStyle}
                value={plannedQuantity}
                onChange={(e) => setPlannedQuantity(e.target.value)}
              />
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
                color: "#d1d5db",
              }}
            >
              <input
                type="checkbox"
                checked={addedInStore}
                onChange={(e) => setAddedInStore(e.target.checked)}
              />
              마트에서 현장 추가한 항목
            </label>

            {message ? (
              <p style={{ color: "#86efac", marginBottom: "12px" }}>{message}</p>
            ) : null}

            {errorMessage ? (
              <p style={{ color: "#fca5a5", marginBottom: "12px" }}>{errorMessage}</p>
            ) : null}

            <button type="submit" style={primaryButtonStyle} disabled={creating}>
              {creating ? "추가 중..." : "항목 추가"}
            </button>
          </form>
        </div>

        <div style={cardStyle}>
          <h2 style={{ marginTop: 0, marginBottom: "16px" }}>장보기 항목</h2>

          {items.length === 0 ? (
            <p style={{ color: "#9ca3af", margin: 0 }}>아직 추가된 항목이 없습니다.</p>
          ) : (
            <div style={{ display: "grid", gap: "14px" }}>
              {items.map((item) => {
                const currentEdit = itemEdits[item.id] || {
                  actual_quantity: "0",
                  unit_price: "0",
                };

                return (
                  <div
                    key={item.id}
                    style={{
                      background: "#111827",
                      border: "1px solid #374151",
                      borderRadius: "14px",
                      padding: "18px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "12px",
                        flexWrap: "wrap",
                        marginBottom: "12px",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "bold", fontSize: "20px" }}>{item.name}</div>
                        <div style={{ color: "#9ca3af", marginTop: "6px" }}>
                          예정 수량: {item.planned_quantity}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {item.added_in_store ? (
                          <span
                            style={{
                              padding: "6px 12px",
                              borderRadius: "999px",
                              background: "#7c3aed",
                              fontSize: "13px",
                              fontWeight: "bold",
                            }}
                          >
                            현장추가
                          </span>
                        ) : null}

                        <span
                          style={{
                            padding: "6px 12px",
                            borderRadius: "999px",
                            background: item.is_in_cart ? "#16a34a" : "#2563eb",
                            fontSize: "13px",
                            fontWeight: "bold",
                          }}
                        >
                          {item.is_in_cart ? "카트 담김" : "미담김"}
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "12px",
                        marginBottom: "14px",
                      }}
                    >
                      <div>
                        <label
                          style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
                        >
                          실제 수량
                        </label>
                        <input
                          type="number"
                          min="0"
                          style={inputStyle}
                          value={currentEdit.actual_quantity}
                          onChange={(e) =>
                            handleEditChange(item.id, "actual_quantity", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label
                          style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
                        >
                          실제 가격
                        </label>
                        <input
                          type="number"
                          min="0"
                          style={inputStyle}
                          value={currentEdit.unit_price}
                          onChange={(e) =>
                            handleEditChange(item.id, "unit_price", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label
                          style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
                        >
                          현재 반영 금액
                        </label>
                        <div
                          style={{
                            ...inputStyle,
                            display: "flex",
                            alignItems: "center",
                            minHeight: "48px",
                          }}
                        >
                          {formatCurrency(Number(item.total_price || 0))}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        type="button"
                        style={primaryButtonStyle}
                        onClick={() => handleAddToCart(item)}
                        disabled={savingItemId === item.id}
                      >
                        {savingItemId === item.id ? "반영 중..." : "카트 반영"}
                      </button>

                      {item.is_in_cart ? (
                        <button
                          type="button"
                          style={secondaryButtonStyle}
                          onClick={() => handleRemoveFromCart(item)}
                          disabled={savingItemId === item.id}
                        >
                          카트 해제
                        </button>
                      ) : null}
                    </div>
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