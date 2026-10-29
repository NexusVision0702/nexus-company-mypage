// components/Header.tsx
import React from 'react';

export default function Header() {
  return (
    <header style={{ 
      background: 'linear-gradient(135deg, #bbf7d0 0%, #4ade80 50%, #22c55e 100%)', 
      padding: '0 40px', 
      height: '115px',   
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      boxShadow: '0 4px 14px rgba(34, 197, 94, 0.25)', 
      marginBottom: '0px',
      borderBottom: '3px solid #15803d',
      boxSizing: 'border-box',
      width: '100%'
    }}>
      {/* 左側キャラクター1 ＆ バッジ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px', height: '100%', flexShrink: 0 }}>
        <img 
          src="/lion1.png" 
          alt="ネクビジョンキャラクター" 
          style={{ height: '100%', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }} 
        />
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.9)', 
          padding: '8px 18px', 
          borderRadius: '24px', 
          boxShadow: '0 3px 8px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255, 255, 255, 0.8)'
        }}>
          <span style={{ color: '#064e3b', fontSize: '18px', fontWeight: '800', whiteSpace: 'nowrap' }}>パートナー様サポート中！</span>
        </div>
      </div>

      {/* 中央：ロゴ ＆ タイトル（「企業マイページ」を中央揃えに修正） */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '22px', flexShrink: '0' }}>
        <img 
          src="/logo.png" 
          alt="ネクビジョン求人ロゴ" 
          style={{ height: '76px', width: 'auto', objectFit: 'contain' }} 
        />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ 
            color: '#ffffff',
            fontSize: '28px', 
            fontWeight: '900', 
            letterSpacing: '1.5px', 
            lineHeight: '1.0',
            textShadow: '0 2px 4px rgba(6, 78, 59, 0.4)',
            whiteSpace: 'nowrap',
            marginBottom: '10px'
          }}>
            ネクビジョ求人
          </div>
          <div style={{ 
            color: '#ffffff', 
            fontSize: '18.1px', 
            letterSpacing: '2px', 
            fontWeight: '700', 
            lineHeight: '1.0',
            textShadow: '0 1px 3px rgba(6, 78, 59, 0.4)',
            opacity: 0.95,
            whiteSpace: 'nowrap'
          }}>
            企業マイページ
          </div>
        </div>
      </div>

      {/* 右側キャラクター2 ＆ バッジ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexDirection: 'row-reverse', height: '100%', flexShrink: 0 }}>
        <img 
          src="/lion2.png" 
          alt="ネクビジョンキャラクター" 
          style={{ height: '100%', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }} 
        />
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.9)', 
          padding: '8px 18px', 
          borderRadius: '24px', 
          boxShadow: '0 3px 8px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          textAlign: 'right' 
        }}>
          <span style={{ color: '#064e3b', fontSize: '18px', fontWeight: '800', whiteSpace: 'nowrap' }}>採用活動をバックアップ！</span>
        </div>
      </div>
    </header>
  );
}