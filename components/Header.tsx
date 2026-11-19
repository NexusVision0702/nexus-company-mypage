// components/Header.tsx
import React from 'react';

export default function Header() {
  return (
    <header className="nexus-header">
      <style>{`
        .nexus-header {
          background: linear-gradient(135deg, #bbf7d0 0%, #4ade80 50%, #22c55e 100%);
          padding: 0 clamp(12px, 3vw, 40px);
          height: clamp(72px, 9vw, 115px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: clamp(8px, 1.5vw, 20px);
          box-shadow: 0 4px 14px rgba(34, 197, 94, 0.25);
          margin-bottom: 0;
          border-bottom: 3px solid #15803d;
          box-sizing: border-box;
          width: 100%;
          max-width: 100%;
          overflow: hidden;
        }
        .nexus-header-side {
          display: flex;
          align-items: center;
          gap: clamp(8px, 1.4vw, 18px);
          height: 100%;
          min-width: 0;
          flex-shrink: 1;
        }
        .nexus-header-side.right {
          flex-direction: row-reverse;
        }
        .nexus-header-char {
          height: 92%;
          width: auto;
          max-height: 108px;
          object-fit: contain;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
          flex-shrink: 0;
        }
        .nexus-header-badge {
          background: rgba(255, 255, 255, 0.92);
          padding: clamp(5px, 0.8vw, 8px) clamp(10px, 1.4vw, 18px);
          border-radius: 24px;
          box-shadow: 0 3px 8px rgba(0,0,0,0.08);
          border: 1px solid rgba(255, 255, 255, 0.8);
          min-width: 0;
        }
        .nexus-header-badge-text {
          color: #064e3b;
          font-size: clamp(12px, 1.25vw, 18px);
          font-weight: 800;
          white-space: nowrap;
          display: block;
        }
        .nexus-header-center {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(10px, 1.8vw, 22px);
          flex-shrink: 0;
        }
        .nexus-header-logo {
          height: clamp(44px, 6vw, 76px);
          width: auto;
          object-fit: contain;
          flex-shrink: 0;
        }
        .nexus-header-title-wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .nexus-header-main-title {
          color: #ffffff;
          font-size: clamp(18px, 2.2vw, 28px);
          font-weight: 900;
          letter-spacing: 1.5px;
          line-height: 1.05;
          text-shadow: 0 2px 4px rgba(6, 78, 59, 0.4);
          white-space: nowrap;
          margin-bottom: clamp(4px, 0.8vw, 10px);
        }
        .nexus-header-sub-title {
          color: #ffffff;
          font-size: clamp(12px, 1.4vw, 18.1px);
          letter-spacing: 2px;
          font-weight: 700;
          line-height: 1.05;
          text-shadow: 0 1px 3px rgba(6, 78, 59, 0.4);
          opacity: 0.95;
          white-space: nowrap;
        }

        /* タブレット幅以下では左右の吹き出しバッジを非表示にしてスッキリ表示 */
        @media (max-width: 1024px) {
          .nexus-header-badge {
            display: none;
          }
        }

        /* スマホ幅以下では中央ロゴ＆タイトルを主役に配置 */
        @media (max-width: 520px) {
          .nexus-header {
            justify-content: center;
            height: 68px;
          }
          .nexus-header-side {
            display: none;
          }
        }
      `}</style>

      {/* 左側キャラクター1 ＆ バッジ */}
      <div className="nexus-header-side">
        <img
          src="/lion1.png"
          alt="ネクビジョンキャラクター"
          className="nexus-header-char"
        />
        <div className="nexus-header-badge">
          <span className="nexus-header-badge-text">パートナー様サポート中！</span>
        </div>
      </div>

      {/* 中央：ロゴ ＆ タイトル */}
      <div className="nexus-header-center">
        <img
          src="/logo.png"
          alt="ネクビジョン求人ロゴ"
          className="nexus-header-logo"
        />
        <div className="nexus-header-title-wrap">
          <div className="nexus-header-main-title">ネクビジョ求人</div>
          <div className="nexus-header-sub-title">企業マイページ</div>
        </div>
      </div>

      {/* 右側キャラクター2 ＆ バッジ */}
      <div className="nexus-header-side right">
        <img
          src="/lion2.png"
          alt="ネクビジョンキャラクター"
          className="nexus-header-char"
        />
        <div className="nexus-header-badge" style={{ textAlign: 'right' }}>
          <span className="nexus-header-badge-text">採用活動をバックアップ！</span>
        </div>
      </div>
    </header>
  );
}