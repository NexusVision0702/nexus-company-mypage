// components/NavigationBar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function NavigationBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [companyName, setCompanyName] = useState<string>('パートナー様');

  useEffect(() => {
    const fetchCompanyName = async () => {
      const companyId = localStorage.getItem('nexus_company_id');
      if (!companyId) return;
      try {
        // ローカルストレージやデフォルト設定から会社名を取得
        setCompanyName('NexusVision株式会社');
      } catch (e) {
        console.error('会社名取得エラー:', e);
      }
    };
    fetchCompanyName();
  }, []);

  // ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem('nexus_company_id');
    router.push('/login');
  };

  const navItems = [
    { label: 'ホーム', href: '/home' },
    { label: '企業情報・経営', href: '/overview' },
    { label: '本社・店舗情報', href: '/stores' },
    { label: '求人作成・プラン選択', href: '/jobs' },
    { label: 'DM', href: '/dm' },
    { label: '応募者履歴', href: '/applicants' },
    { label: 'サポートチャット', href: '/support' },
  ];

  return (
    <nav className="full-bleed-nav" style={{
      background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      padding: '0 40px',
      marginTop: 0,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      boxSizing: 'border-box',
      width: '100%'
    }}>
      {/* 中央：メニュータブ群 */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: '22px 4px',
                color: isActive ? '#166534' : '#475569',
                fontWeight: isActive ? '700' : '600',
                textDecoration: 'none',
                fontSize: '18.75px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {item.label}
              {isActive && (
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '3px',
                  backgroundColor: '#166534',
                  borderRadius: '2px 2px 0 0'
                }} />
              )}
            </Link>
          );
        })}
      </div>

      {/* 右側：会社名バッジ ＆ ログアウトボタン */}
      <div style={{
        position: 'absolute',
        right: '40px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          background: '#f0fdf4',
          border: '1.5px solid #86efac',
          padding: '8px 16px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ color: '#166534', fontSize: '15px', fontWeight: 'bold' }}>
            {companyName}
          </span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: '#fee2e2',
            color: '#991b1b',
            border: '1.5px solid #fecaca',
            padding: '8px 14px',
            borderRadius: '8px',
            fontSize: '13.5px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
        >
          ログアウト
        </button>
      </div>
    </nav>
  );
}