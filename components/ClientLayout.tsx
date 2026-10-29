// components/ClientLayout.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import NavigationBar from '@/components/NavigationBar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // ログインページ（/login）のときはヘッダーを非表示にする
  const isLoginPage = pathname === '/login';

  return (
    <>
      {!isLoginPage && (
        <div style={{ position: 'sticky', top: 0, zIndex: 100, width: '100%' }}>
          <Header />
          <NavigationBar />
        </div>
      )}
      <main className="flex-1">
        {children}
      </main>
    </>
  );
}