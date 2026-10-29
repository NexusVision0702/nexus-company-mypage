// app/jobs/new/components/Section2Salary.tsx (Added '日給' unit option and period handling)
'use client';

import React from 'react';

interface ModelSalary {
  unit: string;
  period: string;
  role: string;
  amount: string;
}

interface Section2Props {
  salaryUnit: string;
  setSalaryUnit: (val: string) => void;
  salaryMode: string;
  setSalaryMode: (val: string) => void;
  salaryFixed: string;
  setSalaryFixed: (val: string) => void;
  salaryMin: string;
  setSalaryMin: (val: string) => void;
  salaryMax: string;
  setSalaryMax: (val: string) => void;
  overtimePayMode: string;
  setOvertimePayMode: (val: string) => void;
  overtimePayHours: string;
  setOvertimePayHours: (val: string) => void;
  overtimePayAmount: string;
  setOvertimePayAmount: (val: string) => void;
  modelSalaries: ModelSalary[];
  addModelSalary: () => void;
  removeModelSalary: (index: number) => void;
  updateModelSalary: (index: number, field: string, value: string) => void;
  salaryDetail: string;
  setSalaryDetail: (val: string) => void;
  inputStyle: React.CSSProperties;
  salaryAmountInputStyle: React.CSSProperties;
  centerNumberInputStyle: React.CSSProperties;
}

// 数値を3桁カンマ区切りの文字列に変換するヘルパー
const formatComma = (val: string) => {
  if (!val || isNaN(Number(val))) return '';
  return Number(val).toLocaleString();
};

export default function Section2Salary({
  salaryUnit,
  setSalaryUnit,
  salaryMode,
  setSalaryMode,
  salaryFixed,
  setSalaryFixed,
  salaryMin,
  setSalaryMin,
  salaryMax,
  setSalaryMax,
  overtimePayMode,
  setOvertimePayMode,
  overtimePayHours,
  setOvertimePayHours,
  overtimePayAmount,
  setOvertimePayAmount,
  modelSalaries,
  addModelSalary,
  removeModelSalary,
  updateModelSalary,
  salaryDetail,
  setSalaryDetail,
  inputStyle,
  salaryAmountInputStyle,
  centerNumberInputStyle
}: Section2Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#065f46', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', margin: 0 }}>2. 報酬・給与・モデル例</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>給与 / 報酬（基本レンジ） *</label>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <select value={salaryUnit} onChange={e => setSalaryUnit(e.target.value)} style={{ ...inputStyle, width: '130px' }}>
            <option value="月給">月給</option>
            <option value="日給">日給</option>
            <option value="時給">時給</option>
            <option value="年収">年収</option>
          </select>
          <select value={salaryMode} onChange={e => setSalaryMode(e.target.value)} style={{ ...inputStyle, width: '130px' }}>
            <option value="固定">固定</option>
            <option value="変動">変動</option>
          </select>

          {salaryMode === '固定' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="number" 
                  max="100000000"
                  placeholder="350000" 
                  value={salaryFixed} 
                  onChange={e => setSalaryFixed(e.target.value)} 
                  required 
                  style={salaryAmountInputStyle} 
                />
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>円</span>
              </div>
              {salaryFixed && !isNaN(Number(salaryFixed)) && (
                <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#059669' }}>
                  💡 表示: {formatComma(salaryFixed)}円
                </span>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="number" 
                  max="100000000"
                  placeholder="下限" 
                  value={salaryMin} 
                  onChange={e => setSalaryMin(e.target.value)} 
                  required 
                  style={salaryAmountInputStyle} 
                />
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>〜</span>
                <input 
                  type="number" 
                  max="100000000"
                  placeholder="上限" 
                  value={salaryMax} 
                  onChange={e => setSalaryMax(e.target.value)} 
                  style={salaryAmountInputStyle} 
                />
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>円</span>
              </div>
              {(salaryMin || salaryMax) && (
                <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#059669' }}>
                  💡 表示: {formatComma(salaryMin)}円 〜 {formatComma(salaryMax)}円
                </span>
              )}
            </div>
          )}
        </div>

        {/* 固定残業代の有無の選択 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#0f172a' }}>固定残業代</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <select value={overtimePayMode} onChange={e => setOvertimePayMode(e.target.value)} style={{ ...inputStyle, width: '160px' }}>
              <option value="含まない">含まない</option>
              <option value="含む">含む</option>
            </select>

            {overtimePayMode === '含む' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <input 
                    type="number" 
                    placeholder="40" 
                    value={overtimePayHours} 
                    onChange={e => setOvertimePayHours(e.target.value)} 
                    style={centerNumberInputStyle} 
                  />
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>時間分 /</span>
                  <input 
                    type="number" 
                    max="100000000"
                    placeholder="65000" 
                    value={overtimePayAmount} 
                    onChange={e => setOvertimePayAmount(e.target.value)} 
                    style={salaryAmountInputStyle} 
                  />
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>円</span>
                </div>
                {overtimePayAmount && !isNaN(Number(overtimePayAmount)) && (
                  <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#059669' }}>
                    💡 固定残業代金額: {formatComma(overtimePayAmount)}円
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* モデル例 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>モデル例（最大3つまで）</label>
          {modelSalaries.length < 3 && (
            <button 
              type="button" 
              onClick={addModelSalary}
              style={{ background: '#f0fdf4', color: '#059669', border: '1px solid #bbf7d0', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
            >
              + モデル例を追加
            </button>
          )}
        </div>

        {modelSalaries.map((item, index) => (
          <div key={index} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>モデル例 {index + 1}</span>
              {modelSalaries.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeModelSalary(index)}
                  style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                >
                  削除
                </button>
              )}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '120px 160px 1fr 180px 30px', gap: '12px', alignItems: 'center' }}>
              <select 
                value={item.unit} 
                onChange={e => updateModelSalary(index, 'unit', e.target.value)} 
                style={inputStyle}
              >
                <option value="年収">年収</option>
                <option value="月給">月給</option>
                <option value="日給">日給</option>
                <option value="時給">時給</option>
              </select>

              {item.unit === '時給' ? (
                <select 
                  value={item.period} 
                  onChange={e => updateModelSalary(index, 'period', e.target.value)} 
                  style={inputStyle}
                >
                  <option value="勤務開始3ヶ月">勤務開始3ヶ月</option>
                  <option value="勤務開始6ヶ月">勤務開始6ヶ月</option>
                  <option value="勤務開始9ヶ月">勤務開始9ヶ月</option>
                  <option value="勤務開始12ヶ月">勤務開始12ヶ月</option>
                  <option value="勤務開始15ヶ月">勤務開始15ヶ月</option>
                  <option value="勤務開始18ヶ月">勤務開始18ヶ月</option>
                  <option value="勤務開始21ヶ月">勤務開始21ヶ月</option>
                  <option value="勤務開始24ヶ月">勤務開始24ヶ月</option>
                </select>
              ) : item.unit === '日給' ? (
                <select 
                  value={item.period} 
                  onChange={e => updateModelSalary(index, 'period', e.target.value)} 
                  style={inputStyle}
                >
                  <option value="稼働初日〜">稼働初日〜</option>
                  <option value="習得期間後">習得期間後</option>
                  <option value="ベテラン枠">ベテラン枠</option>
                </select>
              ) : (
                <select 
                  value={item.period} 
                  onChange={e => updateModelSalary(index, 'period', e.target.value)} 
                  style={inputStyle}
                >
                  <option value="入社1年目">入社1年目</option>
                  <option value="入社3年目">入社3年目</option>
                  <option value="入社5年目">入社5年目</option>
                  <option value="入社7年目">入社7年目</option>
                  <option value="入社10年目">入社10年目</option>
                </select>
              )}

              <input 
                type="text" 
                placeholder="主な業務内容（例: プレイヤーとして成果を牽引）" 
                value={item.role} 
                onChange={e => updateModelSalary(index, 'role', e.target.value)} 
                style={inputStyle} 
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <input 
                  type="number" 
                  max="100000000"
                  placeholder="6000000" 
                  value={item.amount} 
                  onChange={e => updateModelSalary(index, 'amount', e.target.value)} 
                  style={salaryAmountInputStyle} 
                />
                {item.amount && !isNaN(Number(item.amount)) && (
                  <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#059669', whiteSpace: 'nowrap' }}>
                    {formatComma(item.amount)}円
                  </span>
                )}
              </div>

              <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569', whiteSpace: 'nowrap' }}>円</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>給与詳細（インセンティブ支給条件・昇給賞与など）</label>
        <textarea 
          rows={2} 
          placeholder="例: 成果に応じたインセンティブを別途支給。" 
          value={salaryDetail} 
          onChange={e => setSalaryDetail(e.target.value)} 
          style={{ ...inputStyle, resize: 'vertical' }} 
        />
      </div>
    </div>
  );
}