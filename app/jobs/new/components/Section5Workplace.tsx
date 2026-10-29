// app/jobs/new/components/Section5Workplace.tsx
'use client';

import React from 'react';

interface WorkSchedule {
  startHour: string;
  startMin: string;
  endHour: string;
  endMin: string;
  note: string;
}

interface Section5Props {
  locationMode: string;
  setLocationMode: (val: string) => void;
  zipcode: string;
  handleZipChange: (val: string) => void;
  prefAndCity: string;
  setPrefAndCity: (val: string) => void;
  streetNumber: string;
  setStreetNumber: (val: string) => void;
  buildingName: string;
  setBuildingName: (val: string) => void;
  mobileArea: string;
  setMobileArea: (val: string) => void;
  accessMethod: string;
  setAccessMethod: (val: string) => void;
  accessStation: string;
  setAccessStation: (val: string) => void;
  accessMinutes: string;
  setAccessMinutes: (val: string) => void;
  remoteWorkType: string;
  setRemoteWorkType: (val: string) => void;
  remoteWorkDetail: string;
  setRemoteWorkDetail: (val: string) => void;
  workSchedules: WorkSchedule[];
  addWorkSchedule: () => void;
  removeWorkSchedule: (index: number) => void;
  updateWorkSchedule: (index: number, field: string, value: string) => void;
  hours: string[];
  minutes: string[];
  overtimeChoice: string;
  setOvertimeChoice: (val: string) => void;
  overtimeHours: string;
  setOvertimeHours: (val: string) => void;
  probationChoice: string;
  setProbationChoice: (val: string) => void;
  probationDuration: string;
  setProbationDuration: (val: string) => void;
  probationUnit: string;
  setProbationUnit: (val: string) => void;
  probationChange: string;
  setProbationChange: (val: string) => void;
  probationChangeDetail: string;
  setProbationChangeDetail: (val: string) => void;
  holidayType: string;
  setHolidayType: (val: string) => void;
  holidayDetail: string;
  setHolidayDetail: (val: string) => void;
  inputStyle: React.CSSProperties;
  disabledInputStyle: React.CSSProperties;
  centerNumberInputStyle: React.CSSProperties;
  disabledCenterNumberInputStyle: React.CSSProperties;
  stationInputStyle: React.CSSProperties;
}

export default function Section5Workplace({
  locationMode,
  setLocationMode,
  zipcode,
  handleZipChange,
  prefAndCity,
  setPrefAndCity,
  streetNumber,
  setStreetNumber,
  buildingName,
  setBuildingName,
  mobileArea,
  setMobileArea,
  accessMethod,
  setAccessMethod,
  accessStation,
  setAccessStation,
  accessMinutes,
  setAccessMinutes,
  remoteWorkType,
  setRemoteWorkType,
  remoteWorkDetail,
  setRemoteWorkDetail,
  workSchedules,
  addWorkSchedule,
  removeWorkSchedule,
  updateWorkSchedule,
  hours,
  minutes,
  overtimeChoice,
  setOvertimeChoice,
  overtimeHours,
  setOvertimeHours,
  probationChoice,
  setProbationChoice,
  probationDuration,
  setProbationDuration,
  probationUnit,
  setProbationUnit,
  probationChange,
  setProbationChange,
  probationChangeDetail,
  setProbationChangeDetail,
  holidayType,
  setHolidayType,
  holidayDetail,
  setHolidayDetail,
  inputStyle,
  disabledInputStyle,
  centerNumberInputStyle,
  disabledCenterNumberInputStyle,
  stationInputStyle
}: Section5Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#065f46', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', margin: 0 }}>5. 勤務地・勤務時間・職場環境</h3>
      {/* 勤務地形態の選択 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>勤務地の形態 *</label>
          <select 
            value={locationMode} 
            onChange={e => setLocationMode(e.target.value)} 
            style={{ width: '180px', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: '700', color: '#065f46' }}
          >
            <option value="固定勤務地">固定勤務地</option>
            <option value="変動勤務地">変動勤務地</option>
          </select>
        </div>
        {/* メイン拠点の住所入力 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#065f46' }}>メイン拠点の住所 *</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <input 
              type="text" 
              placeholder="郵便番号（例: 9830852）" 
              value={zipcode} 
              onChange={e => handleZipChange(e.target.value)} 
              maxLength={8}
              style={{ ...inputStyle, maxWidth: '280px' }} 
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>※7桁入力すると下の都道府県・市区町村が自動で反映されます</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '4px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>都道府県・市区町村</span>
              <input 
                type="text" 
                placeholder="例: 宮城県仙台市宮城野区" 
                value={prefAndCity} 
                onChange={e => setPrefAndCity(e.target.value)} 
                required 
                style={inputStyle} 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>番地 *</span>
              <input 
                type="text" 
                placeholder="例: 榴岡1-2-3" 
                value={streetNumber} 
                onChange={e => setStreetNumber(e.target.value)} 
                required 
                style={inputStyle} 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>建物名・部屋番号（任意）</span>
              <input 
                type="text" 
                placeholder="例: ◯◯ビル5F" 
                value={buildingName} 
                onChange={e => setBuildingName(e.target.value)} 
                style={inputStyle} 
              />
            </div>
          </div>
        </div>
        {/* 変動勤務地の場合の活動エリア詳細 */}
        {locationMode === '変動勤務地' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#065f46' }}>変動エリア・プロジェクト先の詳細 *</span>
            <input 
              type="text" 
              placeholder="例: 東北エリア各拠点（仙台・盛岡・青森等への巡回・直行直帰あり）" 
              value={mobileArea} 
              onChange={e => setMobileArea(e.target.value)} 
              required 
              style={inputStyle} 
            />
          </div>
        )}
      </div>
      {/* アクセス */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>アクセス</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select value={accessMethod} onChange={e => setAccessMethod(e.target.value)} style={{ ...inputStyle, width: '130px' }}>
            <option value="徒歩">徒歩</option>
            <option value="車">車</option>
            <option value="バス">バス</option>
            <option value="電車">電車</option>
            <option value="自転車">自転車</option>
          </select>
          <input 
            type="text" 
            placeholder="駅名など（例: 仙台駅）" 
            value={accessStation} 
            onChange={e => setAccessStation(e.target.value)} 
            style={stationInputStyle} 
          />
          <input 
            type="number" 
            placeholder="5" 
            value={accessMinutes} 
            onChange={e => setAccessMinutes(e.target.value)} 
            style={centerNumberInputStyle} 
          />
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569', whiteSpace: 'nowrap' }}>分</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>リモートワーク・柔軟な働き方</label>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '12px' }}>
          <select value={remoteWorkType} onChange={e => setRemoteWorkType(e.target.value)} style={inputStyle}>
            <option value="出勤（店舗勤務）">出勤（店舗勤務）</option>
            <option value="フルリモートワーク可">フルリモートワーク可</option>
            <option value="一部リモートワーク可">一部リモートワーク可</option>
            <option value="原則出社（フルオフィス勤務）">原則出社（フルオフィス勤務）</option>
            <option value="フルフレックス制導入">フルフレックス制導入</option>
            <option value="応相談">応相談</option>
          </select>
          <input 
            type="text" 
            placeholder="詳細を入力（例: 週2日までリモート可、コアタイム11:00〜15:00）" 
            value={remoteWorkDetail} 
            onChange={e => setRemoteWorkDetail(e.target.value)} 
            style={inputStyle} 
          />
        </div>
      </div>
      {/* 勤務時間設定 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>勤務時間（最大5つまで登録可能）</label>
          {workSchedules.length < 5 && (
            <button 
              type="button" 
              onClick={addWorkSchedule}
              style={{ background: '#f0fdf4', color: '#059669', border: '1px solid #bbf7d0', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
            >
              + 勤務時間を追加
            </button>
          )}
        </div>
        {workSchedules.map((ws, index) => (
          <div key={index} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>勤務時間パターン {index + 1}</span>
              {workSchedules.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeWorkSchedule(index)}
                  style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                >
                  削除
                </button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 20px 1fr 2fr', gap: '8px', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <select value={ws.startHour} onChange={e => updateWorkSchedule(index, 'startHour', e.target.value)} style={{ ...inputStyle, padding: '10px' }}>
                  {hours.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <span>:</span>
                <select value={ws.startMin} onChange={e => updateWorkSchedule(index, 'startMin', e.target.value)} style={{ ...inputStyle, padding: '10px' }}>
                  {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <span style={{ textAlign: 'center', fontWeight: '700', color: '#64748b' }}>〜</span>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <select value={ws.endHour} onChange={e => updateWorkSchedule(index, 'endHour', e.target.value)} style={{ ...inputStyle, padding: '10px' }}>
                  {hours.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <span>:</span>
                <select value={ws.endMin} onChange={e => updateWorkSchedule(index, 'endMin', e.target.value)} style={{ ...inputStyle, padding: '10px' }}>
                  {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <input 
                type="text" 
                placeholder="備考（例: 通常勤務 / 実働8時間）" 
                value={ws.note} 
                onChange={e => updateWorkSchedule(index, 'note', e.target.value)} 
                style={{ ...inputStyle, padding: '10px' }} 
              />
            </div>
          </div>
        ))}
      </div>
      {/* 残業時間の実態 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>残業時間の実態</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select value={overtimeChoice} onChange={e => setOvertimeChoice(e.target.value)} style={{ ...inputStyle, width: '160px' }}>
            <option value="あり">あり</option>
            <option value="なし">なし</option>
          </select>
          <span style={{ fontSize: '13px', fontWeight: '700', color: overtimeChoice === 'あり' ? '#475569' : '#94a3b8' }}>平均</span>
          <input 
            type="number" 
            placeholder="15" 
            value={overtimeChoice === 'あり' ? overtimeHours : ''} 
            disabled={overtimeChoice === 'なし'}
            onChange={e => setOvertimeHours(e.target.value)} 
            style={overtimeChoice === 'あり' ? centerNumberInputStyle : disabledCenterNumberInputStyle} 
          />
          <span style={{ fontSize: '13px', fontWeight: '700', color: overtimeChoice === 'あり' ? '#475569' : '#94a3b8' }}>時間</span>
        </div>
      </div>
      {/* 試用期間 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>試用期間</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <select value={probationChoice} onChange={e => setProbationChoice(e.target.value)} style={{ ...inputStyle, width: '160px' }}>
            <option value="あり">あり</option>
            <option value="なし">なし</option>
          </select>
          <input 
            type="number" 
            placeholder="3" 
            value={probationChoice === 'あり' ? probationDuration : ''} 
            disabled={probationChoice === 'なし'}
            onChange={e => setProbationDuration(e.target.value)} 
            style={probationChoice === 'あり' ? centerNumberInputStyle : disabledCenterNumberInputStyle} 
          />
          <select 
            value={probationUnit} 
            disabled={probationChoice === 'なし'}
            onChange={e => setProbationUnit(e.target.value)} 
            style={probationChoice === 'あり' ? { ...inputStyle, width: '100px' } : { ...disabledInputStyle, width: '100px' }}
          >
            <option value="月">月</option>
            <option value="日">日</option>
          </select>
          <select 
            value={probationChange} 
            disabled={probationChoice === 'なし'}
            onChange={e => setProbationChange(e.target.value)} 
            style={probationChoice === 'あり' ? { ...inputStyle, width: '180px' } : { ...disabledInputStyle, width: '180px' }}
          >
            <option value="条件変動なし">条件変動なし</option>
            <option value="条件変動あり">条件変動あり</option>
          </select>
        </div>
        {probationChoice === 'あり' && probationChange === '条件変動あり' && (
          <div style={{ marginTop: '4px' }}>
            <input 
              type="text" 
              placeholder="条件変動の詳細を入力（例: 試用期間中は基本給の90%支給など）" 
              value={probationChangeDetail} 
              onChange={e => setProbationChangeDetail(e.target.value)} 
              style={inputStyle} 
            />
          </div>
        )}
      </div>
      {/* 休日・休暇 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>休日・休暇</label>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>休日体系</span>
            <select value={holidayType} onChange={e => setHolidayType(e.target.value)} style={inputStyle}>
              <option value="完全週休2日制（土日祝）">完全週休2日制（土日祝）</option>
              <option value="完全週休2日制（シフト制）">完全週休2日制（シフト制）</option>
              <option value="完全週休3日制">完全週休3日制</option>
              <option value="週休制（シフト制）">週休制（シフト制）</option>
              <option value="その他">その他</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>詳細</span>
            <input 
              type="text" 
              placeholder="詳細を入力（例: 夏季・年末年始休暇、有給休暇、慶弔休暇）" 
              value={holidayDetail} 
              onChange={e => setHolidayDetail(e.target.value)} 
              style={inputStyle} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}