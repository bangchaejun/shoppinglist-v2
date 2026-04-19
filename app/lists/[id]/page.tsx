type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ShoppingListDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#111827",
        color: "#ffffff",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "36px", marginBottom: "12px" }}>
          쇼핑리스트 상세 페이지
        </h1>
        <p style={{ color: "#d1d5db" }}>리스트 ID: {id}</p>
      </div>
    </main>
  );
}