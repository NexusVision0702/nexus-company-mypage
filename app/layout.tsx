// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "../components/ClientLayout"; // ← パスを components に変更

export const metadata: Metadata = {
  title: "ネクビジョ求人 企業マイページ",
  description: "ネクビジョ求人 企業パートナー専用管理画面",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}