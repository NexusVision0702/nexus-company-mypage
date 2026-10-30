// app/jobs/new/components/Section4Requirements.tsx
'use client';

import React from 'react';

interface Section4Props {
  mustRequirements: string;
  setMustRequirements: (val: string) => void;
  wantRequirements: string;
  setWantRequirements: (val: string) => void;
  idealPerson: string;
  setIdealPerson: (val: string) => void;
  inputStyle: React.CSSProperties;
}

export default function Section4Requirements({
  mustRequirements,
  setMustRequirements,
  wantRequirements,
  setWantRequirements,
  idealPerson,
  setIdealPerson,
  inputStyle
}: Section4Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#065f46', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', margin: 0 }}>4. 応募要件（スキル・経験・人物像）</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>【必須】求めるスキル・経験</label>
        <textarea 
          rows={3} 
          placeholder="例: 法人営業経験2年以上、またはマネジメント・プロジェクト推進の経験（業界不問）" 
          value={mustRequirements} 
          onChange={e => setMustRequirements(e.target.value)} 
          style={{ ...inputStyle, resize: 'vertical' }} 
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>【歓迎】望ましい経験・スキル</label>
        <textarea 
          rows={3} 
          placeholder="例: ベンチャー企業での立ち上げ経験、Webサービスの知見、チームマネジメント経験" 
          value={wantRequirements} 
          onChange={e => setWantRequirements(e.target.value)} 
          style={{ ...inputStyle, resize: 'vertical' }} 
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>こんな方と一緒に働きたい（求める人物像）</label>
        <textarea 
          rows={3} 
          placeholder="例: 変化を楽しみながら主体的に行動できる方、チームワークを大切にし周囲と協力して成果を出せる方" 
          value={idealPerson} 
          onChange={e => setIdealPerson(e.target.value)} 
          style={{ ...inputStyle, resize: 'vertical' }} 
        />
      </div>
    </div>
  );
}