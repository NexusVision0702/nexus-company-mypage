// app/dashboard/overview/page.tsx
'use client';

import React, { useState, useEffect } from 'react';

const industryOptions = [
  'ソフトウェア開発・エンジニア', 'インフラ・ネットワークエンジニア',
  'AI・データサイエンティスト', 'Webデザイナー・UI/UX',
  'フロントエンドエンジニア', 'バックエンドエンジニア',
  'プロジェクトマネージャー・ディレクター', '社内SE・情報システム',
  'セキュリティエンジニア', 'ITセールス・プリセールス',
  'カスタマーサクセス・サポート', 'ゲーム開発・クリエイター',
  'Webマーケティング・SEO', 'SNS運用・PR担当',
  '通信インフラ・工事', '法人営業（B2B）',
  '個人営業（B2C）', 'ルートセールス',
  '海外営業・貿易', '営業企画・セールスオペレーション',
  'マーケティング・商品企画', '広報・PR',
  '広告運用・Web広告', 'イベント企画・運営',
  'テレマーケティング・インサイドセールス', '一般事務・アシスタント',
  '営業事務・受発注', '人事・採用・労務',
  '経理・財務・税務', '法務・コンプライアンス',
  '総務・ファシリティ', '秘書・受付',
  '広報・IR', '購買・調達・サプライチェーン',
  'データ入力・キータッチ', 'コールセンター管理・SV',
  '経営企画・事業戦略', '機械設計・CADオペレーター',
  '電気・電子回路設計', '生産管理・工程管理',
  '品質管理・品質保証', '工場製造・組立・加工',
  '溶接・板金・塗装', 'メンテナンス・保守・修理',
  '研究開発・R&D', '化学・素材開発',
  '食品加工・製造', '包装・梱包・検品',
  'プラント運転・管理', '施工管理（建築・土木）',
  'CADオペレーター（建築）', '設計・意匠（建築）',
  '測量・地質調査', '不動産営業・仲介',
  'プロパティマネジメント', 'ビルメンテナンス・管理',
  'リフォーム・内装施工', '土木作業員・施工',
  '看護師・准看護師', '介護職・ヘルパー',
  'ケアマネージャー', '理学療法士・作業療法士',
  '薬剤師', '医療事務・クラーク',
  '保育士・幼稚園教諭', '生活相談員',
  '歯科助手・衛生士', '店長・店舗マネージャー候補',
  'ホールスタッフ・接客', '調理師・シェフ・板前',
  'キッチンスタッフ・調理補助', 'カフェバリスタ・パティシエ',
  '居酒屋・ダイニングスタッフ', 'デリバリー・配達スタッフ',
  '栄養士・調理師', '店長・エリアマネージャー',
  '販売スタッフ・接客', 'VMD・店舗設計',
  'バイヤー・MD（マーチャンダイザー）', 'ECサイト運営・店長',
  'スーパー・コンビニスタッフ', 'アパレル販売・店員',
  'コスメ・美容部員', '配送ドライバー・配達員',
  '大型トラック・長距離ドライバー', 'フォークリフト・倉庫作業',
  '物流管理・配車係', 'ピッキング・梱包スタッフ',
  'タクシー・送迎ドライバー', '通関士・貿易事務',
  '倉庫管理・在庫管理', '経営コンサルタント',
  '財務・M&Aコンサル', '公認会計士・税理士',
  '弁護士・司法書士・行政書士', '通訳・翻訳',
  'グラフィックデザイナー', 'コピーライター・編集者',
  'カメラマン・映像クリエイター', '美容師・スタイリスト',
  'エステティシャン・セラピスト', 'フィットネストレーナー',
  '警備・セキュリティ', '清掃・ビルクリーニング',
  'ホテル・フロントスタッフ', '旅行代理店・ツアープランナー'
];

// 電話番号の自動ハイフン整形関数
function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else if (numbers.length <= 11) {
    if (numbers.startsWith('0') && numbers.length === 10) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  }
}

export default function CompanyOverviewPage() {
  const [loading, setLoading] = useState<boolean>(true);

  // モダンスタイリッシュなトースト通知
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const [editEmail, setEditEmail] = useState<boolean>(false);
  const [editPassword, setEditPassword] = useState<boolean>(false);
  const [editBasic, setEditBasic] = useState<boolean>(false);
  const [editContact, setEditContact] = useState<boolean>(false);
  const [editBusiness, setEditBusiness] = useState<boolean>(false);

  const [authData, setAuthData] = useState({
    originalEmail: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [emailStep, setEmailStep] = useState<'idle' | 'waiting_2fa'>('idle');
  const [verificationCodeInput, setVerificationCodeInput] = useState('');

  const [formData, setFormData] = useState({
    companyName: '',
    corporateNumber: '',
    invoiceNumber: '',
    representativeName: '',
    licenseNumber: '',
    capital: '',
    establishYear: '',
    establishMonth: '',
    establishDay: '',
    industry: [] as string[],
    employeeRegular: '',
    employeePart: '',
    contactName: '',
    accountingContactName: '',
    phone: '',
    accountingEmail: '',
    newAccountingEmail: '',
    homepageUrl: '',
    branchType: '本社',
    postalCode: '',
    prefecture: '',
    city: '',
    addressSub: '',
    businessPhone: '',
    businessEmail: '',
    businessDescription: '',
    newsletter: false
  });

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const getCookie = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(';').shift();
        };

        const companyId = getCookie('nexus_company_id') || localStorage.getItem('nexus_company_id');

        if (!companyId) {
          window.location.href = '/login';
          return;
        }

        const res = await fetch(`/api/company?companyId=${companyId}`);
        
        if (res.status === 401 || res.status === 403) {
          showToast('セッションの有効期限が切れています。再度ログインしてください。', 'error');
          setTimeout(() => { window.location.href = '/login'; }, 1500);
          return;
        }

        if (res.ok) {
          const data = await res.json();
          if (data && data.company) {
            const comp = data.company;
            
            const userEmail = comp.email || comp.businessEmail || '';
            setAuthData({
              originalEmail: userEmail,
              email: userEmail,
              password: '',
              confirmPassword: ''
            });

            let parsedIndustry: string[] = [];
            if (Array.isArray(comp.industry)) {
              parsedIndustry = comp.industry;
            } else if (typeof comp.industry === 'string' && comp.industry.trim() !== '') {
              try {
                const jsonParsed = JSON.parse(comp.industry);
                if (Array.isArray(jsonParsed)) {
                  parsedIndustry = jsonParsed;
                } else {
                  parsedIndustry = comp.industry.split(',').map((s: string) => s.trim()).filter(Boolean);
                }
              } catch {
                parsedIndustry = comp.industry.split(',').map((s: string) => s.trim()).filter(Boolean);
              }
            }

            setFormData({
              companyName: comp.companyName || '',
              corporateNumber: comp.corporateNumber || '',
              representativeName: comp.representativeName || '',
              invoiceNumber: comp.invoiceNumber || '',
              capital: comp.capital || '',
              licenseNumber: comp.licenseNumber || '',
              employeeRegular: comp.employeeRegular !== undefined && comp.employeeRegular !== null ? String(comp.employeeRegular) : '',
              employeePart: comp.employeePart !== undefined && comp.employeePart !== null ? String(comp.employeePart) : '',
              establishYear: comp.establishYear !== undefined && comp.establishYear !== null ? String(comp.establishYear) : '',
              establishMonth: comp.establishMonth !== undefined && comp.establishMonth !== null ? String(comp.establishMonth) : '',
              establishDay: comp.establishDay !== undefined && comp.establishDay !== null ? String(comp.establishDay) : '',
              industry: parsedIndustry,
              contactName: comp.contactName || '',
              accountingContactName: comp.accountingContactName || comp.accountingName || '',
              phone: formatPhoneNumber(comp.phone || ''),
              accountingEmail: comp.accountingEmail || comp.email || '',
              newAccountingEmail: comp.accountingEmail || comp.email || '',
              homepageUrl: comp.homepageUrl || '',
              branchType: comp.branchType || '本社',
              postalCode: comp.postalCode || '',
              prefecture: comp.prefecture || '',
              city: comp.city || '',
              addressSub: comp.addressSub || '',
              businessPhone: formatPhoneNumber(comp.businessPhone || comp.phone || ''),
              businessEmail: userEmail,
              businessDescription: comp.businessDescription || '',
              newsletter: comp.newsletter ?? false
            });
          }
        }
      } catch (err) {
        console.error('企業データの取得エラー:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;
    
    if (target.type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (target as HTMLInputElement).checked }));
      return;
    }

    let value = target.value;
    if (name === 'employeeRegular' || name === 'employeePart') {
      value = value.replace(/[^0-9]/g, '');
    }
    if (name === 'capital') {
      const rawNum = value.replace(/[^0-9]/g, '');
      value = rawNum ? Number(rawNum).toLocaleString() : '';
    }
    // 電話番号フィールドの自動ハイフン適用
    if (name === 'phone' || name === 'businessPhone') {
      value = formatPhoneNumber(value);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setAuthData(prev => ({ ...prev, [e.target.name]: newEmail }));
    if (e.target.name === 'email') {
      setFormData(prev => ({ ...prev, businessEmail: newEmail }));
    }
  };

  const handleCheckboxChange = (option: string) => {
    setFormData(prev => {
      const current = Array.isArray(prev.industry) ? [...prev.industry] : [];
      if (current.includes(option)) {
        return { ...prev, industry: current.filter(item => item !== option) };
      } else {
        return { ...prev, industry: [...current, option] };
      }
    });
  };

  // 1. メールアドレス変更：専用APIで認証コード送信
  const handleRequestEmailChange = async () => {
    if (!authData.email.trim()) {
      showToast('メールアドレスを入力してください。', 'error');
      return;
    }
    if (authData.email === authData.originalEmail) {
      showToast('現在のメールアドレスと同じです。', 'error');
      return;
    }

    try {
      const res = await fetch('/api/company/send-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authData.email }),
      });

      const data = await res.json();
      if (res.ok) {
        setEmailStep('waiting_2fa');
        showToast(`新しいメールアドレス宛に二段階認証コードを送信しました。`);
      } else {
        showToast(`メール送信に失敗しました: ${data.error || '不明なエラー'}`, 'error');
      }
    } catch (e: any) {
      showToast(`通信エラーが発生しました: ${e.message}`, 'error');
    }
  };

  // 2. メールアドレス変更：マイページ専用の独立した検証APIで確認＆DB更新
  const handleVerifyAndSaveEmail = async () => {
    if (!verificationCodeInput.trim()) {
      showToast('二段階認証コードを入力してください。', 'error');
      return;
    }

    try {
      const verifyRes = await fetch('/api/company/verify-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: authData.email, 
          code: verificationCodeInput.trim() 
        }),
      });

      if (!verifyRes.ok) {
        const errData = await verifyRes.json();
        showToast(`認証に失敗しました: ${errData.error || 'コードが正しくありません'}`, 'error');
        return;
      }

      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
      };
      const companyId = getCookie('nexus_company_id') || localStorage.getItem('nexus_company_id');

      const updateRes = await fetch('/api/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, email: authData.email, businessEmail: authData.email }),
      });

      if (updateRes.ok) {
        showToast('メールアドレスを正常に更新しました！');
        setAuthData(prev => ({ ...prev, originalEmail: authData.email }));
        setFormData(prev => ({ ...prev, businessEmail: authData.email }));
        setEditEmail(false);
        setEmailStep('idle');
        setVerificationCodeInput('');
      } else {
        const errData = await updateRes.json();
        showToast(`保存に失敗しました: ${errData.error || '不明なエラー'}`, 'error');
      }
    } catch (e: any) {
      showToast(`通信エラーが発生しました: ${e.message}`, 'error');
    }
  };

  // 3. パスワード変更
  const handleSavePassword = async () => {
    if (!authData.password) {
      showToast('新しいパスワードを入力してください。', 'error');
      return;
    }
    if (authData.password !== authData.confirmPassword) {
      showToast('新しいパスワードと確認用パスワードが一致しません。', 'error');
      return;
    }
    if (authData.password.length < 6) {
      showToast('パスワードは6文字以上で入力してください。', 'error');
      return;
    }

    try {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
      };
      const companyId = getCookie('nexus_company_id') || localStorage.getItem('nexus_company_id');

      const updateRes = await fetch('/api/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, password: authData.password }),
      });

      if (updateRes.ok) {
        showToast('パスワードを正常に更新しました！');
        setAuthData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        setEditPassword(false);
      } else {
        const errData = await updateRes.json();
        showToast(`保存に失敗しました: ${errData.error || '不明なエラー'}`, 'error');
      }
    } catch (e: any) {
      showToast(`通信エラーが発生しました: ${e.message}`, 'error');
    }
  };

  // 4. その他のセクション保存
  const handleSaveSection = async (sectionName: string) => {
    try {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
      };
      const companyId = getCookie('nexus_company_id') || localStorage.getItem('nexus_company_id');

      if (!companyId) {
        showToast('認証情報が見つかりません。再度ログインしてください。', 'error');
        setTimeout(() => { window.location.href = '/login'; }, 1500);
        return;
      }

      const payload = sectionName === '事業詳細'
        ? { companyId, ...formData, businessEmail: authData.email }
        : { companyId, ...formData };

      const res = await fetch('/api/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(`${sectionName}を更新しました！`);
        if (sectionName === '基本情報') setEditBasic(false);
        if (sectionName === '連絡先情報') setEditContact(false);
        if (sectionName === '事業詳細') setEditBusiness(false);
      } else {
        const errData = await res.json();
        showToast(`保存に失敗しました: ${errData.error || '不明なエラー'}`, 'error');
      }
    } catch (e: any) {
      showToast(`通信エラーが発生しました: ${e.message}`, 'error');
    }
  };

  if (loading) return <div style={{ padding: '80px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>読み込み中...</div>;

  const getInputStyle = (isEditing: boolean, alignRight: boolean = false) => ({
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    border: isEditing ? '2px solid #166534' : '1px solid #cbd5e1',
    background: isEditing ? '#ffffff' : '#f1f5f9',
    color: '#0f172a',
    fontSize: '14px',
    textAlign: alignRight ? ('right' as const) : ('left' as const),
    boxSizing: 'border-box' as const,
    outline: 'none',
    boxShadow: isEditing ? '0 0 0 3px rgba(22, 101, 52, 0.1)' : 'none',
    transition: 'all 0.2s ease'
  });

  return (
    <div style={{ minHeight: '90vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '60px 40px', boxSizing: 'border-box', position: 'relative' }}>
      
      {/* モダンスタイリッシュなトースト通知 */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          background: toast.type === 'success' ? '#0f172a' : '#991b1b',
          color: '#ffffff',
          padding: '14px 22px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13.5px',
          fontWeight: '600',
          animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          letterSpacing: '-0.01em'
        }}>
          <span>{toast.type === 'success' ? '✨' : '⚠️'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      <div style={{ maxWidth: '1150px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#166534', marginBottom: '6px' }}>SETTINGS / PROFILE</div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>企業情報・経営</h1>
          </div>

          <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', marginRight: '8px' }}>登録企業名:</span>
              <span style={{ fontSize: '18px', color: '#0f172a', fontWeight: 'bold' }}>{formData.companyName || '未登録'}</span>
            </div>
            <div>
              <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', marginRight: '8px' }}>法人番号:</span>
              <span style={{ fontSize: '18px', color: '#0f172a', fontWeight: 'bold' }}>{formData.corporateNumber || '未登録'}</span>
            </div>
          </div>
        </div>

        {/* ログイン情報セクション */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '24px 32px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>ログイン情報（メールアドレス・パスワード）</h3>
          </div>

          <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            
            {/* 左側：メールアドレス変更エリア */}
            <div style={{ background: editEmail ? '#f0fdf4' : '#f8fafc', border: editEmail ? '2px solid #166534' : '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a' }}>メールアドレス変更</span>
                {!editEmail ? (
                  <button onClick={() => setEditEmail(true)} style={{ background: '#166534', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>編集する</button>
                ) : (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {emailStep === 'idle' ? (
                      <button onClick={handleRequestEmailChange} style={{ background: '#166534', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>認証コード送信</button>
                    ) : (
                      <button onClick={handleVerifyAndSaveEmail} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>コード確認・変更完了</button>
                    )}
                    <button onClick={() => { setEditEmail(false); setEmailStep('idle'); }} style={{ background: '#cbd5e1', color: '#1e293b', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>キャンセル</button>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>メインメールアドレス (ログインID)</label>
                <input type="email" name="email" value={authData.email} onChange={handleAuthChange} disabled={!editEmail} style={getInputStyle(editEmail)} />
              </div>

              {emailStep === 'waiting_2fa' && (
                <div style={{ background: '#fff', border: '1px solid #166534', padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#166534' }}>
                    ✉️ 新しいメールアドレス ({authData.email}) 宛に認証コードを送信しました。
                  </div>
                  <input 
                    type="text" 
                    value={verificationCodeInput} 
                    onChange={e => setVerificationCodeInput(e.target.value)} 
                    placeholder="6桁のコード入力" 
                    maxLength={6}
                    style={{ ...getInputStyle(true, false), background: '#fff', fontSize: '16px', letterSpacing: '0.1em', fontWeight: 'bold' }} 
                  />
                </div>
              )}
            </div>

            {/* 右側：パスワード変更エリア */}
            <div style={{ background: editPassword ? '#f0fdf4' : '#f8fafc', border: editPassword ? '2px solid #166534' : '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a' }}>パスワード変更</span>
                {!editPassword ? (
                  <button onClick={() => setEditPassword(true)} style={{ background: '#166534', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>編集する</button>
                ) : (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={handleSavePassword} style={{ background: '#166534', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>変更を保存</button>
                    <button onClick={() => setEditPassword(false)} style={{ background: '#cbd5e1', color: '#1e293b', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>キャンセル</button>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>新しいパスワード</label>
                <input type="password" name="password" value={authData.password} onChange={handleAuthChange} placeholder="6文字以上で入力" disabled={!editPassword} style={getInputStyle(editPassword)} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>新しいパスワード（確認用）</label>
                <input type="password" name="confirmPassword" value={authData.confirmPassword} onChange={handleAuthChange} placeholder="もう一度入力してください" disabled={!editPassword} style={getInputStyle(editPassword)} />
              </div>
            </div>

          </div>
        </div>

        {/* 企業基本情報セクション */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: editBasic ? '2px solid #166534' : '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '24px 32px', background: editBasic ? '#f0fdf4' : '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>企業基本情報</h3>
            {!editBasic ? (
              <button onClick={() => setEditBasic(true)} style={{ background: '#166534', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>編集する</button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleSaveSection('基本情報')} style={{ background: '#166534', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>変更を保存</button>
                <button onClick={() => setEditBasic(false)} style={{ background: '#cbd5e1', color: '#1e293b', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>キャンセル</button>
              </div>
            )}
          </div>
          <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>インボイス登録番号</label>
              <input type="text" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} placeholder="例: T1234567890123" disabled={!editBasic} style={getInputStyle(editBasic)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>代表者名</label>
              <input type="text" name="representativeName" value={formData.representativeName} onChange={handleChange} placeholder="例: 山田 太郎" disabled={!editBasic} style={getInputStyle(editBasic)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>許認可・資格の有無</label>
              <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} placeholder="例: 許可番号なし" disabled={!editBasic} style={getInputStyle(editBasic)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>資本金</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="text" name="capital" value={formData.capital} onChange={handleChange} placeholder="例: 1,000" disabled={!editBasic} style={getInputStyle(editBasic, true)} />
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#475569', whiteSpace: 'nowrap' }}>万円</span>
              </div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>業種・職種（複数選択可：現在 {formData.industry.length}件選択中）</label>
              <div style={{ maxHeight: '220px', overflowY: 'auto', border: editBasic ? '2px solid #166534' : '1px solid #cbd5e1', borderRadius: '10px', padding: '16px', background: editBasic ? '#fff' : '#f1f5f9', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {industryOptions.map((opt, i) => {
                  const isChecked = formData.industry.includes(opt);
                  return (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#0f172a', cursor: editBasic ? 'pointer' : 'default' }}>
                      <input type="checkbox" checked={isChecked} onChange={() => editBasic && handleCheckboxChange(opt)} disabled={!editBasic} style={{ width: '16px', height: '16px', accentColor: '#166534' }} />
                      {opt}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 連絡先・経理担当者セクション */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: editContact ? '2px solid #166534' : '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '24px 32px', background: editContact ? '#f0fdf4' : '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>連絡先・経理担当者</h3>
            {!editContact ? (
              <button onClick={() => setEditContact(true)} style={{ background: '#166534', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>編集する</button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleSaveSection('連絡先情報')} style={{ background: '#166534', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>変更を保存</button>
                <button onClick={() => setEditContact(false)} style={{ background: '#cbd5e1', color: '#1e293b', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>キャンセル</button>
              </div>
            )}
          </div>
          <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>採用担当者</label>
              <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} disabled={!editContact} style={getInputStyle(editContact)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>経理ご担当者名 (部署名)</label>
              <input type="text" name="accountingContactName" value={formData.accountingContactName} onChange={handleChange} disabled={!editContact} style={getInputStyle(editContact)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>連絡先電話番号（経理担当者）</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} disabled={!editContact} placeholder="080-0000-0000" maxLength={13} style={getInputStyle(editContact)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>請求書送付用メールアドレス（経理担当者）</label>
              <input type="email" name="accountingEmail" value={formData.accountingEmail} onChange={handleChange} disabled={!editContact} style={getInputStyle(editContact)} />
            </div>
          </div>
        </div>

        {/* 事業詳細セクション */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: editBusiness ? '2px solid #166534' : '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '24px 32px', background: editBusiness ? '#f0fdf4' : '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>事業詳細</h3>
            {!editBusiness ? (
              <button onClick={() => setEditBusiness(true)} style={{ background: '#166534', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>編集する</button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleSaveSection('事業詳細')} style={{ background: '#166534', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>変更を保存</button>
                <button onClick={() => setEditBusiness(false)} style={{ background: '#cbd5e1', color: '#1e293b', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>キャンセル</button>
              </div>
            )}
          </div>
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>ホームページURL</label>
              <input type="text" name="homepageUrl" value={formData.homepageUrl} onChange={handleChange} disabled={!editBusiness} style={getInputStyle(editBusiness)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>電話番号 (必須)</label>
                <input type="text" name="businessPhone" value={formData.businessPhone} onChange={handleChange} disabled={!editBusiness} placeholder="03-0000-0000" maxLength={13} style={getInputStyle(editBusiness)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>メールアドレス（変更不可）IDと共通</label>
                <input type="email" name="businessEmail" value={authData.email} disabled={true} style={{ ...getInputStyle(false), background: '#e2e8f0', color: '#475569', cursor: 'not-allowed' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>事業内容 (必須)</label>
              <textarea name="businessDescription" value={formData.businessDescription} onChange={handleChange} disabled={!editBusiness} rows={4} style={{ ...getInputStyle(editBusiness), resize: 'vertical' }} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}