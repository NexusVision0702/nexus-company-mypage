// app/dashboard/jobs/new/components/Section3Mission.tsx
'use client';

import React from 'react';

interface Section3Props {
  mission: string;
  setMission: (val: string) => void;
  dailyWork: string;
  setDailyWork: (val: string) => void;
  careerPath: string;
  setCareerPath: (val: string) => void;
  inputStyle: React.CSSProperties;
  hasSubmitted?: boolean; // ★ 追加
}

export default function Section3Mission({
  mission,
  setMission,
  dailyWork,
  setDailyWork,
  careerPath,
  setCareerPath,
  inputStyle,
  hasSubmitted = false // ★ 追加
}: Section3Props) {
  // 未入力チェックの判定
  const isMissionError = hasSubmitted && !mission.trim();
  const isDailyWorkError = hasSubmitted && !dailyWork.trim();
  const isCareerPathError = hasSubmitted && !careerPath.trim();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#065f46', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', margin: 0 }}>3. ミッション・仕事内容・キャリアパス</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: isMissionError ? '#ef4444' : '#0f172a' }}>
          ① このポジションのミッション（役割・重要性） * <span style={{ fontSize: '11px', color: '#64748b' }}>（30文字以上）</span>
          {isMissionError && <span style={{ fontSize: '11.5px', color: '#ef4444', marginLeft: '8px' }}>※入力必須です</span>}
        </label>
        <textarea 
          rows={3} 
          placeholder="例: 自社サービスの拡大および新規プロジェクトの立ち上げを牽引し、将来の事業責任者として組織を引っ張っていただきます。" 
          value={mission} 
          onChange={e => setMission(e.target.value)} 
          required 
          className={isMissionError ? 'input-error' : ''}
          style={{ ...inputStyle, resize: 'vertical' }} 
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: isDailyWorkError ? '#ef4444' : '#0f172a' }}>
          ② 具体的な業務内容・1日の流れ *
          {isDailyWorkError && <span style={{ fontSize: '11.5px', color: '#ef4444', marginLeft: '8px' }}>※入力必須です</span>}
        </label>
        <textarea 
          rows={4} 
          placeholder="例: クライアント折衝、プロジェクトの進行管理、メンバーの進捗サポートなど。午前はミーティングと戦略立案、午後は実務・折衝にあたります。" 
          value={dailyWork} 
          onChange={e => setDailyWork(e.target.value)} 
          className={isDailyWorkError ? 'input-error' : ''}
          style={{ ...inputStyle, resize: 'vertical' }} 
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: isCareerPathError ? '#ef4444' : '#0f172a' }}>
          ③ 入社後のキャリアパス・成長環境 *
          {isCareerPathError && <span style={{ fontSize: '11.5px', color: '#ef4444', marginLeft: '8px' }}>※入力必須です</span>}
        </label>
        <textarea 
          rows={3} 
          placeholder="例: 入社後半年でリーダー、1年〜2年でマネージャーや事業責任者への登用実績あり。裁量権が大きく早期のキャリアアップが可能です。" 
          value={careerPath} 
          onChange={e => setCareerPath(e.target.value)} 
          className={isCareerPathError ? 'input-error' : ''}
          style={{ ...inputStyle, resize: 'vertical' }} 
        />
      </div>
    </div>
  );
}