// components/ClientLayout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import NavigationBar from '@/components/NavigationBar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      const companyId = localStorage.getItem('nexus_company_id');
      setIsLoggedIn(!!companyId);
    };

    checkLogin();

    window.addEventListener('storage', checkLogin);
    const interval = setInterval(checkLogin, 500);

    return () => {
      window.removeEventListener('storage', checkLogin);
      clearInterval(interval);
    };
  }, []);

  // ログインページ（/login）のときは、上部の緑色ヘッダーもメニューも完全に非表示にする
  const isLoginPage = pathname === '/login';

  return (
    <div style={{ minHeight: '100vh', width: '100%', maxWidth: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      {!isLoginPage && (
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Header />
          <NavigationBar />
        </div>
      )}
      <main
        className="flex-1"
        style={{
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </main>
    </div>
  );
}