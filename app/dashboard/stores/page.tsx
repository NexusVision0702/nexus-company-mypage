// app/dashboard/stores/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { StoreLocation } from '../../../types/company';

const daysOfWeek = ['月', '火', '水', '木', '金', '土', '日', '祝日', '正月', 'GW', 'シルバーウィーク'];

const hourOptions = ['-', '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];
const minuteOptions = ['-', '00', '10', '20', '30', '40', '50'];

interface ExtendedStoreLocation extends StoreLocation {
  prefecture?: string;
  city?: string;
  addressSub?: string;
  employeeRegular?: string;
  employeePart?: string;
  businessDays?: string[];
  businessDaysNote?: string;
  weekdayStartHour?: string;
  weekdayStartMin?: string;
  weekdayEndHour?: string;
  weekdayEndMin?: string;
  holidayStartHour?: string;
  holidayStartMin?: string;
  holidayEndHour?: string;
  holidayEndMin?: string;
  newsletter?: boolean;
  isNew?: boolean;
  isEditing?: boolean;
  newEmail?: string;
  email2FAStatus?: 'idle' | 'waiting';
  sentCode?: string;
  inputCode?: string;
}

export default function StoresPage() {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [isEditingHQ, setIsEditingHQ] = useState<boolean>(false);
  const [branchType, setBranchType] = useState<string>('本社');
  const [postalCode, setPostalCode] = useState<string>('9830852');
  const [prefecture, setPrefecture] = useState<string>('宮城県');
  const [city, setCity] = useState<string>('仙台市宮城野区');
  const [addressSub, setAddressSub] = useState<string>('榴岡1-2-3');
  const [hqPhone, setHqPhone] = useState<string>('022-000-0000');

  const [stores, setStores] = useState<ExtendedStoreLocation[]>([
    {
      name: '仙台駅前支店',
      postalCode: '9800021',
      prefecture: '宮城県',
      city: '仙台市青葉区',
      addressSub: '中央1-1-1',
      address: '〒9800021 宮城県仙台市青葉区中央1-1-1',
      managerName: '佐藤 太郎',
      phone: '022-111-2222',
      email: 'sendai@nexus-vision.net',
      newEmail: 'sendai@nexus-vision.net',
      employeeRegular: '5',
      employeePart: '8',
      businessDays: ['月', '火', '水', '木', '金'],
      businessDaysNote: '土日祝日は定休日となります。',
      weekdayStartHour: '09',
      weekdayStartMin: '00',
      weekdayEndHour: '18',
      weekdayEndMin: '00',
      holidayStartHour: '-',
      holidayStartMin: '-',
      holidayEndHour: '-',
      holidayEndMin: '-',
      newsletter: true,
      isNew: false,
      isEditing: false,
      email2FAStatus: 'idle',
      sentCode: '',
      inputCode: ''
    }
  ]);

  useEffect(() => {
    const id = localStorage.getItem('nexus_company_id');
    if (!id) {
      localStorage.setItem('nexus_company_id', 'demo_company_001');
      setCompanyId('demo_company_001');
    } else {
      setCompanyId(id);
    }
    setLoading(false);
  }, []);

  const isAnyEditing = isEditingHQ || stores.some(st => st.isNew || st.isEditing);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isAnyEditing) {
        e.preventDefault();
        e.returnValue = '変更が保存されていません。変更を保存してください。';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isAnyEditing]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (target && isAnyEditing) {
        e.preventDefault();
        e.stopPropagation();
        alert('変更や登録が保存されていません。');
      }
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [isAnyEditing]);

  const handlePhoneFormat = (value: string) => {
    const rawDigits = value.replace(/[^0-9]/g, '').slice(0, 11);
    if (rawDigits.length > 7) {
      return `${rawDigits.slice(0, 3)}-${rawDigits.slice(3, 7)}-${rawDigits.slice(7)}`;
    } else if (rawDigits.length > 3) {
      return `${rawDigits.slice(0, 3)}-${rawDigits.slice(3)}`;
    } else {
      return rawDigits;
    }
  };

  const handlePostalCodeChange = async (code: string) => {
    const cleanCode = code.replace(/[^0-9]/g, '').slice(0, 7);
    setPostalCode(cleanCode);
    setIsEditingHQ(true);

    if (cleanCode.length === 7) {
      try {
        const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanCode}`);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          setPrefecture(data.results[0].address1);
          setCity(data.results[0].address2 + data.results[0].address3);
        }
      } catch (err) {
        console.error('住所自動取得エラー:', err);
      }
    }
  };

  const handleStorePostalChange = async (index: number, code: string) => {
    const cleanCode = code.replace(/[^0-9]/g, '').slice(0, 7);
    const updated = [...stores];
    updated[index] = { ...updated[index], postalCode: cleanCode, isEditing: true };
    setStores(updated);

    if (cleanCode.length === 7) {
      try {
        const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanCode}`);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          updated[index] = {
            ...updated[index],
            prefecture: data.results[0].address1,
            city: data.results[0].address2 + data.results[0].address3
          };
          setStores([...updated]);
        }
      } catch (err) {
        console.error('店舗住所自動取得エラー:', err);
      }
    }
  };

  const handleAddStore = () => {
    setStores([...stores, { 
      name: '', 
      postalCode: '', 
      prefecture: '', 
      city: '', 
      addressSub: '', 
      address: '', 
      managerName: '', 
      phone: '', 
      email: '', 
      newEmail: '', 
      employeeRegular: '',
      employeePart: '',
      businessDays: [],
      businessDaysNote: '',
      weekdayStartHour: '-',
      weekdayStartMin: '-',
      weekdayEndHour: '-',
      weekdayEndMin: '-',
      holidayStartHour: '-',
      holidayStartMin: '-',
      holidayEndHour: '-',
      holidayEndMin: '-',
      newsletter: true,
      isNew: true,
      isEditing: true,
      email2FAStatus: 'idle', 
      sentCode: '', 
      inputCode: '' 
    }]);
  };

  const handleStoreChange = (index: number, field: string, value: any) => {
    const updated = [...stores];
    let processedValue = value;

    if (field === 'email') {
      processedValue = value.replace(/[^a-zA-Z0-9@.\-_+]/g, '');
      updated[index] = { ...updated[index], newEmail: processedValue, isEditing: true };
    } else if (field === 'phone') {
      processedValue = handlePhoneFormat(value);
      updated[index] = { ...updated[index], [field]: processedValue, isEditing: true };
    } else if (field === 'employeeRegular' || field === 'employeePart') {
      processedValue = value.replace(/[^0-9]/g, '');
      updated[index] = { ...updated[index], [field]: processedValue, isEditing: true };
    } else if (field === 'newsletter') {
      updated[index] = { ...updated[index], newsletter: value, isEditing: true };
    } else {
      updated[index] = { ...updated[index], [field]: processedValue, isEditing: true };
    }
    setStores(updated);
  };

  const handleStoreDayToggle = (index: number, day: string) => {
    const updated = [...stores];
    const currentDays = updated[index].businessDays || [];
    let newDays;
    if (currentDays.includes(day)) {
      newDays = currentDays.filter(d => d !== day);
    } else {
      newDays = [...currentDays, day];
    }
    updated[index] = { ...updated[index], businessDays: newDays, isEditing: true };
    setStores(updated);
  };

  const handleRequestStoreEmail2FA = (index: number) => {
    const store = stores[index];
    if (!store.newEmail || store.newEmail === store.email) {
      alert('変更後の新しいメールアドレスを入力してください。');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(store.newEmail)) {
      alert('有効なメールアドレスの形式で入力してください。');
      return;
    }
    const mockCode = String(Math.floor(100000 + Math.random() * 900000));
    const updated = [...stores];
    updated[index] = { ...updated[index], email2FAStatus: 'waiting', sentCode: mockCode, isEditing: true };
    setStores(updated);
    alert(`【シミュレーション】新しい店舗メールアドレス（ ${store.newEmail} ）宛に二段階認証コード [ ${mockCode} ] を送信しました。`);
  };

  const handleVerifyStoreEmail2FA = (index: number) => {
    const store = stores[index];
    if ((store.inputCode || '').trim() !== store.sentCode) {
      alert('二段階認証コードが一致しません。正しいコードを入力してください。');
      return;
    }
    const updated = [...stores];
    updated[index] = {
      ...updated[index],
      email: store.newEmail,
      email2FAStatus: 'idle',
      sentCode: '',
      inputCode: '',
      isEditing: true
    };
    setStores(updated);
    alert('店舗メールアドレスの変更が承認されました！');
  };

  const handleDeleteStore = (index: number) => {
    const updated = stores.filter((_, i) => i !== index);
    setStores(updated);
    alert('店舗を削除しました。');
  };

  const validateStore = (store: ExtendedStoreLocation) => {
    if (!store.name || !store.postalCode || !store.prefecture || !store.city || !store.addressSub || !store.managerName || !store.phone || store.employeeRegular === '' || store.employeePart === '') {
      alert('すべての項目を入力してください。');
      return false;
    }
    return true;
  };

  const handleRegisterStore = (index: number) => {
    const store = stores[index];
    if (!validateStore(store)) return;

    if (store.newEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(store.newEmail)) {
        alert('有効なメールアドレスの形式で入力してください。');
        return;
      }
    }
    const updated = [...stores];
    updated[index].email = store.newEmail || store.email;
    updated[index].isNew = false;
    updated[index].isEditing = false;
    setStores(updated);
    alert('店舗を登録しました！');
  };

  const handleSaveHQ = async () => {
    alert('本社情報を変更しました！');
    setIsEditingHQ(false);
  };

  const handleSaveStoreChanges = async (index: number) => {
    const store = stores[index];
    if (!validateStore(store)) return;

    if (store.newEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(store.newEmail)) {
        alert('有効なメールアドレスの形式で入力してください。');
        return;
      }
    }
    const updated = [...stores];
    updated[index].isEditing = false;
    setStores(updated);
    alert('店舗情報を変更しました！');
  };

  if (loading) return <div style={{ padding: '80px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>読み込み中...</div>;

  const getFieldStyle = (editing: boolean, maxWidthValue?: string, alignRight: boolean = false) => ({
    width: '100%',
    maxWidth: maxWidthValue || 'none',
    padding: '11px 14px',
    borderRadius: '10px',
    border: editing ? '2px solid #166534' : '1px solid #cbd5e1',
    background: editing ? '#ffffff' : '#f1f5f9',
    color: '#0f172a',
    fontSize: '14px',
    textAlign: alignRight ? ('right' as const) : ('left' as const),
    boxSizing: 'border-box' as const,
    outline: 'none',
    boxShadow: editing ? '0 0 0 3px rgba(22, 101, 52, 0.1)' : 'none',
    transition: 'all 0.2s ease'
  });

  return (
    <div style={{ minHeight: '90vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '60px 40px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1150px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#166534', marginBottom: '6px' }}>SETTINGS / STORES</div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>本社・店舗情報</h1>
          </div>
        </div>

        {isAnyEditing && (
          <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', color: '#b45309', padding: '14px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>⚠️ 変更・登録が保存されていません。各セクションの保存ボタンを押してください。</span>
          </div>
        )}

        {/* 1. 本社所在地情報セクション */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: isEditingHQ ? '2px solid #166534' : '1px solid #e2e8f0', boxShadow: isEditingHQ ? '0 10px 25px -5px rgba(22, 101, 52, 0.15)' : '0 4px 20px -2px rgba(0, 0, 0, 0.03)', overflow: 'hidden', transition: 'all 0.25s ease' }}>
          <div style={{ padding: '24px 32px', background: isEditingHQ ? '#f0fdf4' : '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#166534' }}></div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>本社所在地情報</h3>
                {isEditingHQ && <span style={{ fontSize: '11.5px', fontWeight: 'bold', color: '#166534' }}>✏️ 編集モード中</span>}
              </div>
            </div>
            
            {!isEditingHQ ? (
              <button onClick={() => setIsEditingHQ(true)} style={{ background: '#166534', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>編集する</button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleSaveHQ} style={{ background: '#166534', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>本社情報を変更する</button>
                <button onClick={() => setIsEditingHQ(false)} style={{ background: '#cbd5e1', color: '#1e293b', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>キャンセル</button>
              </div>
            )}
          </div>

          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>拠点の種類</label>
              <div style={{ display: 'flex', gap: '24px' }}>
                {['本社', '支社・支店'].map((type) => (
                  <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: '600', color: '#0f172a', cursor: isEditingHQ ? 'pointer' : 'default' }}>
                    <input 
                      type="radio" 
                      name="branchType" 
                      value={type} 
                      checked={branchType === type} 
                      onChange={() => { setBranchType(type); setIsEditingHQ(true); }} 
                      disabled={!isEditingHQ} 
                      style={{ accentColor: '#166534', width: '18px', height: '18px', cursor: isEditingHQ ? 'pointer' : 'default', margin: 0 }}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#166534', marginBottom: '4px' }}>本社の所在地</label>
              <div style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '6px' }}>郵便番号 (7桁入力で即座に自動反映)</div>
              <input 
                type="text" 
                value={postalCode} 
                onChange={(e) => handlePostalCodeChange(e.target.value)} 
                placeholder="例: 9830021" 
                disabled={!isEditingHQ} 
                style={getFieldStyle(isEditingHQ, '240px')} 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>都道府県</label>
                <input type="text" value={prefecture} onChange={e => { setPrefecture(e.target.value); setIsEditingHQ(true); }} placeholder="自動入力" disabled={!isEditingHQ} style={getFieldStyle(isEditingHQ)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>市区町村・町域</label>
                <input type="text" value={city} onChange={e => { setCity(e.target.value); setIsEditingHQ(true); }} placeholder="自動入力" disabled={!isEditingHQ} style={getFieldStyle(isEditingHQ)} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>それ以降の住所 (番地・ビル名など)</label>
              <input type="text" value={addressSub} onChange={e => { setAddressSub(e.target.value); setIsEditingHQ(true); }} placeholder="例: 中央1-1-1" disabled={!isEditingHQ} style={getFieldStyle(isEditingHQ)} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>電話番号</label>
              <input 
                type="text" 
                value={hqPhone} 
                onChange={e => { setHqPhone(handlePhoneFormat(e.target.value)); setIsEditingHQ(true); }} 
                placeholder="例: 022-000-0000" 
                disabled={!isEditingHQ} 
                style={getFieldStyle(isEditingHQ, '240px')} 
              />
            </div>
          </div>
        </div>

        {/* 2. 登録店舗またはオフィス一覧セクション */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.03)', overflow: 'hidden' }}>
          <div style={{ padding: '24px 32px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2563eb' }}></div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>登録店舗またはオフィス一覧 ({stores.length}件)</h3>
            </div>
            
            <button 
              onClick={handleAddStore} 
              style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              店舗またはオフィスを追加する
            </button>
          </div>

          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {stores.length === 0 ? (
              <div style={{ color: '#64748b', fontSize: '14px', fontStyle: 'italic', padding: '20px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                登録されている追加店舗・オフィスはありません。「店舗またはオフィスを追加する」ボタンからご登録ください。
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {stores.map((store, sIdx) => {
                  const isStoreActiveEdit = !!(store.isNew || store.isEditing);
                  return (
                    <div key={sIdx} style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: isStoreActiveEdit ? '2px solid #166534' : '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'all 0.2s ease' }}>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <input type="text" value={store.name} onChange={e => handleStoreChange(sIdx, 'name', e.target.value)} placeholder="店舗名またはオフィス名を入力" disabled={!isStoreActiveEdit} style={{ padding: '10px 14px', borderRadius: '8px', border: isStoreActiveEdit ? '2px solid #166534' : '1px solid #cbd5e1', background: isStoreActiveEdit ? '#fff' : '#f1f5f9', fontSize: '14px', fontWeight: 'bold', width: '50%', boxSizing: 'border-box', outline: 'none' }} />
                        
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {store.isNew ? (
                            <button onClick={() => handleRegisterStore(sIdx)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '12.5px', fontWeight: 'bold', cursor: 'pointer' }}>登録</button>
                          ) : !store.isEditing ? (
                            <button onClick={() => { const up = [...stores]; up[sIdx].isEditing = true; setStores(up); }} style={{ background: '#166534', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '12.5px', fontWeight: 'bold', cursor: 'pointer' }}>編集する</button>
                          ) : (
                            <button onClick={() => handleSaveStoreChanges(sIdx)} style={{ background: '#166534', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '12.5px', fontWeight: 'bold', cursor: 'pointer' }}>変更を保存</button>
                          )}
                          <button onClick={() => handleDeleteStore(sIdx)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '12.5px', fontWeight: 'bold', cursor: 'pointer' }}>削除</button>
                        </div>
                      </div>

                      <div style={{ background: '#ffffff', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <div style={{ fontSize: '11.5px', color: '#166534', fontWeight: 'bold', marginBottom: '4px' }}>郵便番号 (7桁入力で即座に自動反映)</div>
                          <input 
                            type="text" 
                            value={store.postalCode || ''} 
                            onChange={e => handleStorePostalChange(sIdx, e.target.value)} 
                            placeholder="例: 9830021" 
                            disabled={!isStoreActiveEdit} 
                            style={getFieldStyle(isStoreActiveEdit, '220px')} 
                          />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div>
                            <div style={{ fontSize: '11.5px', color: '#166534', fontWeight: 'bold', marginBottom: '4px' }}>都道府県</div>
                            <input type="text" value={store.prefecture || ''} onChange={e => handleStoreChange(sIdx, 'prefecture', e.target.value)} placeholder="自動入力" disabled={!isStoreActiveEdit} style={getFieldStyle(isStoreActiveEdit)} />
                          </div>
                          <div>
                            <div style={{ fontSize: '11.5px', color: '#166534', fontWeight: 'bold', marginBottom: '4px' }}>市区町村・町域</div>
                            <input type="text" value={store.city || ''} onChange={e => handleStoreChange(sIdx, 'city', e.target.value)} placeholder="自動入力" disabled={!isStoreActiveEdit} style={getFieldStyle(isStoreActiveEdit)} />
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11.5px', color: '#166534', fontWeight: 'bold', marginBottom: '4px' }}>それ以降の住所 (番地・ビル名など)</div>
                          <input type="text" value={store.addressSub || ''} onChange={e => handleStoreChange(sIdx, 'addressSub', e.target.value)} placeholder="例: 中央1-1-1" disabled={!isStoreActiveEdit} style={getFieldStyle(isStoreActiveEdit)} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <div style={{ fontSize: '11.5px', color: '#166534', fontWeight: 'bold', marginBottom: '4px' }}>責任者名</div>
                          <input type="text" value={store.managerName || ''} onChange={e => handleStoreChange(sIdx, 'managerName', e.target.value)} placeholder="責任者名を入力" disabled={!isStoreActiveEdit} style={getFieldStyle(isStoreActiveEdit)} />
                        </div>
                        <div>
                          <div style={{ fontSize: '11.5px', color: '#166534', fontWeight: 'bold', marginBottom: '4px' }}>電話番号</div>
                          <input type="text" value={store.phone || ''} onChange={e => handleStoreChange(sIdx, 'phone', e.target.value)} placeholder="例: 店舗電話番号または代表電話番号" disabled={!isStoreActiveEdit} style={getFieldStyle(isStoreActiveEdit)} />
                        </div>
                      </div>

                      {/* 従業員数（正社員 / パート・アルバイト） */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <div style={{ fontSize: '11.5px', color: '#166534', fontWeight: 'bold', marginBottom: '4px' }}>従業員数（正社員）</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <input 
                              type="text" 
                              value={store.employeeRegular || ''} 
                              onChange={e => handleStoreChange(sIdx, 'employeeRegular', e.target.value)} 
                              placeholder="例: 5" 
                              disabled={!isStoreActiveEdit} 
                              style={getFieldStyle(isStoreActiveEdit, undefined, true)} 
                            />
                            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold' }}>名</span>
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11.5px', color: '#166534', fontWeight: 'bold', marginBottom: '4px' }}>従業員数（パート・アルバイト）</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <input 
                              type="text" 
                              value={store.employeePart || ''} 
                              onChange={e => handleStoreChange(sIdx, 'employeePart', e.target.value)} 
                              placeholder="例: 10" 
                              disabled={!isStoreActiveEdit} 
                              style={getFieldStyle(isStoreActiveEdit, undefined, true)} 
                            />
                            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold' }}>名</span>
                          </div>
                        </div>
                      </div>

                      {/* 2カラムレイアウト：左側に営業時間、右側に営業日・詳細 */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', alignItems: 'start' }}>
                        
                        {/* 左側：営業時間 */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#166534' }}>営業時間またはオフィス情報</div>
                          
                          {/* 平日 */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <span style={{ fontSize: '11.5px', fontWeight: '600', color: '#475569' }}>平日</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                              <select 
                                value={store.weekdayStartHour || '-'} 
                                onChange={e => handleStoreChange(sIdx, 'weekdayStartHour', e.target.value)} 
                                disabled={!isStoreActiveEdit} 
                                style={{ ...getFieldStyle(isStoreActiveEdit), width: '58px', padding: '8px 6px' }}
                              >
                                {hourOptions.map((h, idx) => <option key={idx} value={h}>{h}</option>)}
                              </select>
                              <span style={{ fontSize: '12px', color: '#475569' }}>時</span>
                              <select 
                                value={store.weekdayStartMin || '-'} 
                                onChange={e => handleStoreChange(sIdx, 'weekdayStartMin', e.target.value)} 
                                disabled={!isStoreActiveEdit} 
                                style={{ ...getFieldStyle(isStoreActiveEdit), width: '58px', padding: '8px 6px' }}
                              >
                                {minuteOptions.map((m, idx) => <option key={idx} value={m}>{m}</option>)}
                              </select>
                              <span style={{ fontSize: '12px', color: '#475569' }}>分</span>

                              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', margin: '0 2px' }}>〜</span>

                              <select 
                                value={store.weekdayEndHour || '-'} 
                                onChange={e => handleStoreChange(sIdx, 'weekdayEndHour', e.target.value)} 
                                disabled={!isStoreActiveEdit} 
                                style={{ ...getFieldStyle(isStoreActiveEdit), width: '58px', padding: '8px 6px' }}
                              >
                                {hourOptions.map((h, idx) => <option key={idx} value={h}>{h}</option>)}
                              </select>
                              <span style={{ fontSize: '12px', color: '#475569' }}>時</span>
                              <select 
                                value={store.weekdayEndMin || '-'} 
                                onChange={e => handleStoreChange(sIdx, 'weekdayEndMin', e.target.value)} 
                                disabled={!isStoreActiveEdit} 
                                style={{ ...getFieldStyle(isStoreActiveEdit), width: '58px', padding: '8px 6px' }}
                              >
                                {minuteOptions.map((m, idx) => <option key={idx} value={m}>{m}</option>)}
                              </select>
                              <span style={{ fontSize: '12px', color: '#475569' }}>分</span>
                            </div>
                          </div>

                          {/* 土日祝 */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <span style={{ fontSize: '11.5px', fontWeight: '600', color: '#475569' }}>土日祝</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                              <select 
                                value={store.holidayStartHour || '-'} 
                                onChange={e => handleStoreChange(sIdx, 'holidayStartHour', e.target.value)} 
                                disabled={!isStoreActiveEdit} 
                                style={{ ...getFieldStyle(isStoreActiveEdit), width: '58px', padding: '8px 6px' }}
                              >
                                {hourOptions.map((h, idx) => <option key={idx} value={h}>{h}</option>)}
                              </select>
                              <span style={{ fontSize: '12px', color: '#475569' }}>時</span>
                              <select 
                                value={store.holidayStartMin || '-'} 
                                onChange={e => handleStoreChange(sIdx, 'holidayStartMin', e.target.value)} 
                                disabled={!isStoreActiveEdit} 
                                style={{ ...getFieldStyle(isStoreActiveEdit), width: '58px', padding: '8px 6px' }}
                              >
                                {minuteOptions.map((m, idx) => <option key={idx} value={m}>{m}</option>)}
                              </select>
                              <span style={{ fontSize: '12px', color: '#475569' }}>分</span>

                              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', margin: '0 2px' }}>〜</span>

                              <select 
                                value={store.holidayEndHour || '-'} 
                                onChange={e => handleStoreChange(sIdx, 'holidayEndHour', e.target.value)} 
                                disabled={!isStoreActiveEdit} 
                                style={{ ...getFieldStyle(isStoreActiveEdit), width: '58px', padding: '8px 6px' }}
                              >
                                {hourOptions.map((h, idx) => <option key={idx} value={h}>{h}</option>)}
                              </select>
                              <span style={{ fontSize: '12px', color: '#475569' }}>時</span>
                              <select 
                                value={store.holidayEndMin || '-'} 
                                onChange={e => handleStoreChange(sIdx, 'holidayEndMin', e.target.value)} 
                                disabled={!isStoreActiveEdit} 
                                style={{ ...getFieldStyle(isStoreActiveEdit), width: '58px', padding: '8px 6px' }}
                              >
                                {minuteOptions.map((m, idx) => <option key={idx} value={m}>{m}</option>)}
                              </select>
                              <span style={{ fontSize: '12px', color: '#475569' }}>分</span>
                            </div>
                          </div>
                        </div>

                        {/* 右側：営業日＆営業日の詳細 */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ fontSize: '11.5px', color: '#166534', fontWeight: 'bold' }}>営業日（該当する曜日を選択）</div>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {daysOfWeek.map((day) => {
                                const isSelected = (store.businessDays || []).includes(day);
                                return (
                                  <button
                                    key={day}
                                    type="button"
                                    disabled={!isStoreActiveEdit}
                                    onClick={() => handleStoreDayToggle(sIdx, day)}
                                    style={{
                                      padding: '5px 10px',
                                      borderRadius: '6px',
                                      border: isSelected ? '2px solid #166534' : '1px solid #cbd5e1',
                                      background: isSelected ? '#f0fdf4' : '#ffffff',
                                      color: isSelected ? '#166534' : '#64748b',
                                      fontSize: '12px',
                                      fontWeight: 'bold',
                                      cursor: isStoreActiveEdit ? 'pointer' : 'default',
                                      transition: 'all 0.2s'
                                    }}
                                  >
                                    {day}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 'bold' }}>営業日の詳細（備考）</div>
                            <input 
                              type="text" 
                              value={store.businessDaysNote || ''} 
                              onChange={e => handleStoreChange(sIdx, 'businessDaysNote', e.target.value)} 
                              placeholder="例: お正月期間の営業はしておりません。" 
                              disabled={!isStoreActiveEdit} 
                              style={getFieldStyle(isStoreActiveEdit)} 
                            />
                          </div>
                        </div>
                      </div>

                      {/* メルマガ希望チェックボックス */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: isStoreActiveEdit ? '#ffffff' : '#f1f5f9', padding: '14px 18px', borderRadius: '10px', border: isStoreActiveEdit ? '1.5px solid #166534' : '1px solid #cbd5e1' }}>
                        <input 
                          type="checkbox" 
                          id={`newsletter-${sIdx}`}
                          checked={store.newsletter !== undefined ? store.newsletter : true} 
                          onChange={e => handleStoreChange(sIdx, 'newsletter', e.target.checked)} 
                          disabled={!isStoreActiveEdit} 
                          style={{ width: '18px', height: '18px', accentColor: '#166534', cursor: isStoreActiveEdit ? 'pointer' : 'default' }} 
                        />
                        <label htmlFor={`newsletter-${sIdx}`} style={{ fontSize: '13.5px', fontWeight: '600', color: '#0f172a', cursor: isStoreActiveEdit ? 'pointer' : 'default' }}>
                          メルマガ・お知らせ受領を希望する
                        </label>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {isStoreActiveEdit && !store.isNew ? (
                          <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', border: '1.5px dashed #166534', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ fontSize: '11.5px', fontWeight: 'bold', color: '#166534' }}>店舗メールアドレス変更 (要二段階認証)</div>
                            {store.email2FAStatus !== 'waiting' ? (
                              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input type="email" value={store.newEmail || ''} onChange={e => handleStoreChange(sIdx, 'email', e.target.value)} placeholder="新しい店舗メールアドレス" style={getFieldStyle(true)} />
                                <button onClick={() => handleRequestStoreEmail2FA(sIdx)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}>新しいアドレスに二段階認証コード送信</button>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#fff', padding: '10px', borderRadius: '6px', border: '1.5px solid #166534' }}>
                                <span style={{ fontSize: '12px', color: '#1e293b' }}>新アドレス（{store.newEmail}）宛に送信された6桁のコードを入力してください。</span>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                  <input type="text" value={store.inputCode || ''} onChange={e => { const up = [...stores]; up[sIdx].inputCode = e.target.value; setStores(up); }} placeholder="6桁のコード" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '160px', fontSize: '13px' }} />
                                  <button onClick={() => handleVerifyStoreEmail2FA(sIdx)} style={{ background: '#166534', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>承認して変更を完了する</button>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : store.isNew ? (
                          <input type="email" value={store.newEmail || ''} onChange={e => handleStoreChange(sIdx, 'email', e.target.value)} placeholder="店舗メールアドレスを入力 (例: info@example.com)" style={getFieldStyle(true)} />
                        ) : null}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}