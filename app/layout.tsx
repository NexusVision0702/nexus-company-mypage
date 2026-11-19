// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientLayout from "../components/ClientLayout"; // ← パスを components に変更

export const metadata: Metadata = {
  title: "ネクビジョ求人 企業マイページ",
  description: "ネクビジョ求人 企業パートナー専用管理画面",
  icons: {
    icon: "/logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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