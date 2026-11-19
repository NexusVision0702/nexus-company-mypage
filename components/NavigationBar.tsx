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
        setCompanyName('NexusVision株式会社');
      } catch (e) {
        console.error('会社名取得エラー:', e);
      }
    };
    fetchCompanyName();
  }, []);

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
    <nav className="full-bleed-nav nexus-nav">
      <style>{`
        .nexus-nav {
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          padding: 0 clamp(12px, 3vw, 40px);
          margin-top: 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          box-sizing: border-box;
          width: 100%;
          max-width: 100%;
        }
        .nexus-nav-tabs {
          display: flex;
          gap: clamp(14px, 2.2vw, 32px);
          align-items: center;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .nexus-nav-tabs::-webkit-scrollbar {
          display: none;
        }
        .nexus-nav-link {
          padding: clamp(14px, 1.8vw, 22px) 4px;
          text-decoration: none;
          font-size: clamp(14px, 1.35vw, 18.75px);
          position: relative;
          display: flex;
          align-items: center;
          transition: color 0.2s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .nexus-nav-right {
          position: absolute;
          right: clamp(12px, 3vw, 40px);
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .nexus-nav-company {
          background: #f0fdf4;
          border: 1.5px solid #86efac;
          padding: 7px 14px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
          display: flex;
          align-items: center;
          max-width: 240px;
        }
        .nexus-nav-company-text {
          color: #166534;
          font-size: clamp(12.5px, 1.1vw, 15px);
          font-weight: bold;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .nexus-nav-logout {
          background: #fee2e2;
          color: #991b1b;
          border: 1.5px solid #fecaca;
          padding: 7px 12px;
          border-radius: 8px;
          font-size: clamp(12px, 1vw, 13.5px);
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .nexus-nav-logout:hover {
          background: #fecaca;
        }

        /* 1440px以下ではタブと右側ボタンが重ならないよう2段構成に自動切替 */
        @media (max-width: 1440px) {
          .nexus-nav {
            flex-direction: column;
            align-items: stretch;
            padding-top: 8px;
            padding-bottom: 0;
          }
          .nexus-nav-right {
            position: static;
            justify-content: flex-end;
            padding-bottom: 6px;
            border-bottom: 1px solid #f1f5f9;
          }
          .nexus-nav-tabs {
            justify-content: flex-start;
            width: 100%;
          }
        }
      `}</style>

      {/* 右側：会社名バッジ ＆ ログアウトボタン */}
      <div className="nexus-nav-right">
        <div className="nexus-nav-company">
          <span className="nexus-nav-company-text">{companyName}</span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="nexus-nav-logout"
        >
          ログアウト
        </button>
      </div>

      {/* 中央：メニュータブ群 */}
      <div className="nexus-nav-tabs">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname === `/dashboard${item.href}` ||
            Boolean(pathname?.startsWith(`/dashboard${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              className="nexus-nav-link"
              style={{
                color: isActive ? '#166534' : '#475569',
                fontWeight: isActive ? '700' : '600',
              }}
            >
              {item.label}
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '3px',
                    backgroundColor: '#166534',
                    borderRadius: '2px 2px 0 0',
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}