// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import NavigationBar from "@/components/NavigationBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ネクビジョ求人 企業パートナー専用ポータル",
  description: "企業パートナー専用のポータルサイトです。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f8fafc] m-0 p-0 overflow-x-hidden">
        {/* どのページに移動しても常に最上部に固定されるヘッダー＆ナビゲーション */}
        <div style={{ position: 'sticky', top: 0, zIndex: 100, width: '100%' }}>
          <Header />
          <NavigationBar />
        </div>
        
        {/* 各ページのコンテンツがここに流れ込みます */}
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}