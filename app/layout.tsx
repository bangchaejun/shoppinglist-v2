import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "ShoppingList V2",
  description: "서비스형 쇼핑리스트/장바구니 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif", background: "#111827" }}>
        <header
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #374151",
            background: "#0f172a",
          }}
        >
          <nav
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Link href="/" style={{ color: "#ffffff", textDecoration: "none", fontWeight: "bold" }}>
              Home
            </Link>
            <Link href="/login" style={{ color: "#d1d5db", textDecoration: "none" }}>
              Login
            </Link>
            <Link href="/signup" style={{ color: "#d1d5db", textDecoration: "none" }}>
              Signup
            </Link>
            <Link href="/dashboard" style={{ color: "#d1d5db", textDecoration: "none" }}>
              Dashboard
            </Link>
            <Link href="/history" style={{ color: "#d1d5db", textDecoration: "none" }}>
              History
            </Link>
            <Link href="/settings" style={{ color: "#d1d5db", textDecoration: "none" }}>
              Settings
            </Link>
          </nav>
        </header>

        <div>{children}</div>
      </body>
    </html>
  );
}