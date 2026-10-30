// app/jobs/new/components/Section6CompanyCulture.tsx
'use client';

import React from 'react';

const commonBenefitsList = [
  '社会保険完備',
  '交通費支給（上限あり）',
  '交通費全額支給',
  '書籍購入補助',
  '資格取得支援',
  'リモートワーク手当',
  '住宅手当・家賃補助',
  '家族手当・扶養手当',
  '定期健康診断',
  '社員食堂・食事補助',
  '副業OK',
  'インセンティブ制度',
  '服装自由・私服可',
  'ネイル・髪型自由',
  '時短勤務制度あり',
  '出産・育児支援制度',
  '社員登用制度',
  '各種表彰制度',
  '引っ越し手当・社宅あり',
  'PC・スマホ支給'
];

interface LocationItem {
  id: string;
  name: string;
  address: string;
}

interface Section6Props {
  teamAtmosphere: string;
  setTeamAtmosphere: (val: string) => void;
  selectedBenefits: string[];
  handleBenefitToggle: (benefit: string) => void;
  benefitsExtra: string;
  setBenefitsExtra: (val: string) => void;
  smoking: string;
  setSmoking: (val: string) => void;
  selectionSteps: string[];
  addSelectionStep: () => void;
  removeSelectionStep: (index: number) => void;
  updateSelectionStep: (index: number, val: string) => void;
  jobImages: string[];
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  inputStyle: React.CSSProperties;
  availableLocations: LocationItem[];
  selectedPostingLocation: string;
  setSelectedPostingLocation: (val: string) => void;
}

export default function Section6CompanyCulture({
  teamAtmosphere,
  setTeamAtmosphere,
  selectedBenefits = [],
  handleBenefitToggle = () => {},
  benefitsExtra = '',
  setBenefitsExtra = () => {},
  smoking = '屋内禁煙（専用喫煙室あり）',
  setSmoking = () => {},
  selectionSteps = ['書類選考', '一次面接', '最終面接', '内定'],
  addSelectionStep = () => {},
  removeSelectionStep = () => {},
  updateSelectionStep = () => {},
  jobImages = [],
  handleImageUpload = () => {},
  handleRemoveImage = () => {},
  inputStyle,
  availableLocations = [],
  selectedPostingLocation = '',
  setSelectedPostingLocation = () => {}
}: Section6Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#065f46', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', margin: 0 }}>6. 福利厚生・社風・選考プロセス・写真</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>チームの雰囲気・社風 *</label>
        <textarea 
          rows={3}
          placeholder="例: 平均年齢32歳。フラットで意見が言いやすく、裁量権を持って挑戦できる環境です。" 
          value={teamAtmosphere} 
          onChange={e => setTeamAtmosphere(e.target.value)} 
          required 
          style={{ ...inputStyle, resize: 'vertical' }} 
        />
      </div>

      {/* 職場写真の掲載 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
            職場・オフィスの写真（最大7枚 / 現在 {jobImages.length}/7枚）
          </label>
          <span style={{ fontSize: '11.5px', color: '#64748b' }}>※オフィス風景やスタッフの様子など</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
          {jobImages.map((imgUrl, index) => (
            <div key={index} style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #cbd5e1', background: '#f8fafc', boxShadow: '0 4px 10px rgba(0,0,0,0.04)' }}>
              <img src={imgUrl} alt={`求人画像 ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(239, 68, 68, 0.95)', color: '#fff', border: 'none', width: '26px', height: '26px', borderRadius: '50%', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
                title="削除"
              >
                ×
              </button>
            </div>
          ))}

          {jobImages.length < 7 && (
            <label style={{ 
              width: '100%', 
              height: '140px', 
              borderRadius: '16px', 
              border: '2px dashed #94a3b8', 
              background: '#f8fafc', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '6px', 
              cursor: 'pointer',
              color: '#475569',
              fontSize: '13px',
              fontWeight: '700',
              transition: 'all 0.2s'
            }}>
              <span style={{ fontSize: '24px', color: '#059669', lineHeight: 1 }}>＋</span>
              写真を追加
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          )}
        </div>
      </div>

      {/* 福利厚生・各種手当 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>福利厚生・各種手当 *</label>
        
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
          {commonBenefitsList.map((benefit) => {
            const isChecked = selectedBenefits.includes(benefit);
            return (
              <label 
                key={benefit} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontSize: '13.5px', 
                  color: '#334155', 
                  cursor: 'pointer',
                  userSelect: 'none' 
                }}
              >
                <input 
                  type="checkbox" 
                  checked={isChecked} 
                  onChange={() => handleBenefitToggle(benefit)}
                  style={{ width: '16px', height: '16px', accentColor: '#059669', cursor: 'pointer' }} 
                />
                {benefit}
              </label>
            );
          })}
        </div>

        <input 
          type="text" 
          placeholder="その他の福利厚生・手当を追加入力（例: 社有車貸与、退職金制度あり）" 
          value={benefitsExtra} 
          onChange={e => setBenefitsExtra(e.target.value)} 
          style={{ ...inputStyle, marginTop: '4px' }} 
        />
      </div>

      {/* 選考プロセス */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px', 
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
        padding: '24px', 
        borderRadius: '20px', 
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '13.5px', fontWeight: '800', color: '#0f172a' }}>選考プロセス（進行フロー・最大6ステップ） *</label>
            <p style={{ fontSize: '11.5px', color: '#64748b', margin: '2px 0 0 0' }}>※ステップ数に応じて自動で幅が調整され、最大6つまで設定できます</p>
          </div>
          {selectionSteps.length < 6 && (
            <button 
              type="button" 
              onClick={(e) => {
                e.preventDefault();
                addSelectionStep();
              }}
              style={{ 
                background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', 
                color: '#ffffff', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '10px', 
                fontSize: '12px', 
                fontWeight: '700', 
                cursor: 'pointer', 
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)', 
                whiteSpace: 'nowrap'
              }}
            >
              ＋ ステップを追加
            </button>
          )}
        </div>

        <div style={{ 
          background: '#ffffff', 
          border: '1px solid #e2e8f0', 
          borderRadius: '16px', 
          padding: '20px 16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          overflowX: 'auto', 
          gap: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
        }}>
          {selectionSteps.map((step, index) => (
            <React.Fragment key={index}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '8px', 
                flex: '1 1 0',
                minWidth: '100px',
                position: 'relative'
              }}>
                {selectionSteps.length > 1 && (
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.preventDefault();
                      removeSelectionStep(index);
                    }}
                    style={{ 
                      position: 'absolute',
                      top: '-8px',
                      right: '2px',
                      background: '#fef2f2', 
                      color: '#ef4444', 
                      border: '1px solid #fee2e2', 
                      width: '20px', 
                      height: '20px', 
                      borderRadius: '50%', 
                      fontSize: '11px', 
                      fontWeight: '700', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      zIndex: 10
                    }}
                    title="このステップを削除"
                  >
                    ×
                  </button>
                )}

                <div style={{ 
                  width: '28px', 
                  height: '28px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #059669 0%, #34d399 100%)', 
                  color: '#ffffff', 
                  fontSize: '12px', 
                  fontWeight: '800', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)'
                }}>
                  {index + 1}
                </div>

                <input 
                  type="text" 
                  value={step} 
                  onChange={e => updateSelectionStep(index, e.target.value)} 
                  placeholder={`ステップ${index + 1}`} 
                  required
                  style={{ 
                    width: '100%', 
                    padding: '8px 6px', 
                    borderRadius: '8px', 
                    border: '1px solid #cbd5e1', 
                    background: '#f8fafc', 
                    color: '#0f172a', 
                    fontSize: '12.5px', 
                    fontWeight: '700',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                    outline: 'none' 
                  }} 
                />
              </div>

              {index < selectionSteps.length - 1 && (
                <div style={{ 
                  flex: '0 0 16px', 
                  height: '3px', 
                  background: '#10b981', 
                  borderRadius: '2px',
                  marginTop: '22px',
                  opacity: 0.6 
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 求人を出している拠点・店舗（本社の場合は「本社」と表示） ＆ 受動喫煙防止措置 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>求人を出している拠点・店舗 *</label>
          <select 
            value={selectedPostingLocation} 
            onChange={e => setSelectedPostingLocation(e.target.value)} 
            style={inputStyle} 
            required
          >
            {availableLocations.map((loc) => {
              const displayLabel = `${loc.name}（${loc.address || '住所未登録'}）`;
              return (
                <option key={loc.id} value={displayLabel}>
                  {displayLabel}
                </option>
              );
            })}
          </select>
          <span style={{ fontSize: '11px', color: '#64748b' }}>※「本社・店舗情報」に登録された情報から選択</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>受動喫煙防止措置 *</label>
          <select value={smoking} onChange={e => setSmoking(e.target.value)} style={inputStyle} required>
            <option value="屋内禁煙（専用喫煙室あり）">屋内禁煙（専用喫煙室あり）</option>
            <option value="完全禁煙（敷地内・屋内すべて禁煙）">完全禁煙（敷地内・屋内すべて禁煙）</option>
            <option value="屋内禁煙（喫煙スペースなし）">屋内禁煙（喫煙スペースなし）</option>
          </select>
        </div>
      </div>
    </div>
  );
}