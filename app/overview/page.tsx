// app/overview/page.tsx (Without the manual button and modal)
'use client';

import React, { useState, useEffect } from 'react';

const industryOptions = [
  'ソフトウェア開発・エンジニア',
  'インフラ・ネットワークエンジニア',
  'AI・データサイエンティスト',
  'Webデザイナー・UI/UX',
  'フロントエンドエンジニア',
  'バックエンドエンジニア',
  'プロジェクトマネージャー・ディレクター',
  '社内SE・情報システム',
  'セキュリティエンジニア',
  'ITセールス・プリセールス',
  'カスタマーサクセス・サポート',
  'ゲーム開発・クリエイター',
  'Webマーケティング・SEO',
  'SNS運用・PR担当',
  '通信インフラ・工事',
  '法人営業（B2B）',
  '個人営業（B2C）',
  'ルートセールス',
  '海外営業・貿易',
  '営業企画・セールスオペレーション',
  'マーケティング・商品企画',
  '広報・PR',
  '広告運用・Web広告',
  'イベント企画・運営',
  'テレマーケティング・インサイドセールス',
  '一般事務・アシスタント',
  '営業事務・受発注',
  '人事・採用・労務',
  '経理・財務・税務',
  '法務・コンプライアンス',
  '総務・ファシリティ',
  '秘書・受付',
  '広報・IR',
  '購買・調達・サプライチェーン',
  'データ入力・キータッチ',
  'コールセンター管理・SV',
  '経営企画・事業戦略',
  '機械設計・CADオペレーター',
  '電気・電子回路設計',
  '生産管理・工程管理',
  '品質管理・品質保証',
  '工場製造・組立・加工',
  '溶接・板金・塗装',
  'メンテナンス・保守・修理',
  '研究開発・R&D',
  '化学・素材開発',
  '食品加工・製造',
  '包装・梱包・検品',
  'プラント運転・管理',
  '施工管理（建築・土木）',
  'CADオペレーター（建築）',
  '設計・意匠（建築）',
  '測量・地質調査',
  '不動産営業・仲介',
  'プロパティマネジメント',
  'ビルメンテナンス・管理',
  'リフォーム・内装施工',
  '土木作業員・施工',
  '看護師・准看護師',
  '介護職・ヘルパー',
  'ケアマネージャー',
  '理学療法士・作業療法士',
  '薬剤師',
  '医療事務・クラーク',
  '保育士・幼稚園教諭',
  '生活相談員',
  '歯科助手・衛生士',
  '店長・店舗マネージャー候補',
  'ホールスタッフ・接客',
  '調理師・シェフ・板前',
  'キッチンスタッフ・調理補助',
  'カフェバリスタ・パティシエ',
  '居酒屋・ダイニングスタッフ',
  'デリバリー・配達スタッフ',
  '栄養士・調理師',
  '店長・エリアマネージャー',
  '販売スタッフ・接客',
  'VMD・店舗設計',
  'バイヤー・MD（マーチャンダイザー）',
  'ECサイト運営・店長',
  'スーパー・コンビニスタッフ',
  'アパレル販売・店員',
  'コスメ・美容部員',
  '配送ドライバー・配達員',
  '大型トラック・長距離ドライバー',
  'フォークリフト・倉庫作業',
  '物流管理・配車係',
  'ピッキング・梱包スタッフ',
  'タクシー・送迎ドライバー',
  '通関士・貿易事務',
  '倉庫管理・在庫管理',
  '経営コンサルタント',
  '財務・M&Aコンサル',
  '公認会計士・税理士',
  '弁護士・司法書士・行政書士',
  '通訳・翻訳',
  'グラフィックデザイナー',
  'コピーライター・編集者',
  'カメラマン・映像クリエイター',
  '美容師・スタイリスト',
  'エステティシャン・セラピスト',
  'フィットネストレーナー',
  '警備・セキュリティ',
  '清掃・ビルクリーニング',
  'ホテル・フロントスタッフ',
  '旅行代理店・ツアープランナー'
];

export default function CompanyOverviewPage() {
  const [loading, setLoading] = useState<boolean>(true);

  const [editAuth, setEditAuth] = useState<boolean>(false);
  const [editBasic, setEditBasic] = useState<boolean>(false);
  const [editContact, setEditContact] = useState<boolean>(false);
  const [editBusiness, setEditBusiness] = useState<boolean>(false);

  const [authData, setAuthData] = useState({
    email: 'yoshihisahasama@gmail.com',
    newEmail: 'yoshihisahasama@gmail.com',
    password: '••••••••',
    newPassword: '',
    confirmPassword: ''
  });

  const [authStep, setAuthStep] = useState<'idle' | 'waiting_email_2fa' | 'waiting_pass_2fa' | 'waiting_invoice_email_2fa'>('idle');
  const [authType, setAuthType] = useState<'email' | 'password' | 'invoice_email' | null>(null);
  const [verificationCodeInput, setVerificationCodeInput] = useState('');
  const [mockSentCode, setMockSentCode] = useState('');

  const [formData, setFormData] = useState({
    companyName: 'NexusVision株式会社',
    corporateNumber: '8370001051493',
    invoiceNumber: 'T1234567890123',
    representativeName: '挾間 義尚',
    licenseNumber: '許可番号なし',
    capital: '10,000,000',
    establishYear: '2026',
    establishMonth: '10',
    establishDay: '01',
    industry: ['ソフトウェア開発・エンジニア', 'フロントエンドエンジニア'],
    employeeRegular: '15',
    employeePart: '5',
    contactName: '挾間 義尚',
    accountingContactName: '経理担当',
    phone: '090-0000-0000',
    accountingEmail: 'accounting@nexus-vision.net',
    newAccountingEmail: 'accounting@nexus-vision.net',
    homepageUrl: 'https://company.nexus-vision.net',
    branchType: '本社',
    postalCode: '9830852',
    prefecture: '宮城県',
    city: '仙台市宮城野区',
    addressSub: '榴岡1-2-3',
    businessPhone: '022-000-0000',
    businessEmail: 'support@nexus-vision.net',
    businessDescription: 'ネクビジョ求人プラットフォームの運営およびシステム開発',
    newsletter: true
  });

  const isAnyEditing = editAuth || editBasic || editContact || editBusiness || authStep !== 'idle';

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isAnyEditing) {
        e.preventDefault();
        e.returnValue = '変更が保存されていません。手続きを完了してください。';
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
        alert('変更や二段階認証が未完了です。手続きを完了させてください。');
      }
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [isAnyEditing]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      const companyId = localStorage.getItem('nexus_company_id');
      if (!companyId) {
        localStorage.setItem('nexus_company_id', 'demo_company_001');
      }
      setLoading(false);
    };
    fetchCompanyData();
  }, []);

  const handlePostalCodeChange = async (code: string) => {
    const cleanCode = code.replace(/[^0-9]/g, '').slice(0, 7);
    setFormData(prev => ({ ...prev, postalCode: cleanCode }));

    if (cleanCode.length === 7) {
      try {
        const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanCode}`);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          setFormData(prev => ({
            ...prev,
            prefecture: result.address1,
            city: result.address2 + result.address3
          }));
        }
      } catch (err) {
        console.error('住所自動取得エラー:', err);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;
    
    if (target.type === 'checkbox') {
      setFormData({ ...formData, [name]: (target as HTMLInputElement).checked });
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
    if (name === 'phone' || name === 'businessPhone') {
      const rawDigits = value.replace(/[^0-9]/g, '').slice(0, 11);
      if (rawDigits.length > 7) {
        value = `${rawDigits.slice(0, 3)}-${rawDigits.slice(3, 7)}-${rawDigits.slice(7)}`;
      } else if (rawDigits.length > 3) {
        value = `${rawDigits.slice(0, 3)}-${rawDigits.slice(3)}`;
      } else {
        value = rawDigits;
      }
    }
    if (name === 'accountingEmail' || name === 'newAccountingEmail' || name === 'businessEmail') {
      value = value.replace(/[^a-zA-Z0-9@.\-_+]/g, '');
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthData({ ...authData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (option: string) => {
    const current = [...formData.industry];
    if (current.includes(option)) {
      setFormData({ ...formData, industry: current.filter(item => item !== option) });
    } else {
      setFormData({ ...formData, industry: [...current, option] });
    }
  };

  const handleRequestAuthUpdate = (type: 'email' | 'password' | 'invoice_email') => {
    if (type === 'email' && (authData.newPassword || formData.newAccountingEmail !== formData.accountingEmail)) {
      alert('複数の認証情報を同時に変更することはできません。ひとつずつ完了させてください。');
      return;
    }
    if (type === 'password' && (authData.newEmail !== authData.email || formData.newAccountingEmail !== formData.accountingEmail)) {
      alert('複数の認証情報を同時に変更することはできません。ひとつずつ完了させてください。');
      return;
    }
    if (type === 'invoice_email' && (authData.newPassword || authData.newEmail !== authData.email)) {
      alert('複数の認証情報を同時に変更することはできません。ひとつずつ完了させてください。');
      return;
    }

    setAuthType(type);
    const mockCode = String(Math.floor(100000 + Math.random() * 900000));
    setMockSentCode(mockCode);

    if (type === 'email') {
      if (!authData.newEmail || authData.newEmail === authData.email) {
        alert('変更後の新しいメールアドレスを入力してください。');
        return;
      }
      setAuthStep('waiting_email_2fa');
      alert(`【シミュレーション】新しいメインメールアドレス（ ${authData.newEmail} ）宛に二段階認証コード [ ${mockCode} ] を送信しました。`);
    } else if (type === 'password') {
      if (!authData.newPassword || authData.newPassword.length < 6) {
        alert('新しいパスワードは6文字以上で入力してください。');
        return;
      }
      if (authData.newPassword !== authData.confirmPassword) {
        alert('確認用パスワードが一致しません。');
        return;
      }
      setAuthStep('waiting_pass_2fa');
      alert(`【シミュレーション】現在のアドレス（ ${authData.email} ）宛に二段階認証コード [ ${mockCode} ] を送信しました。`);
    } else if (type === 'invoice_email') {
      if (!formData.newAccountingEmail || formData.newAccountingEmail === formData.accountingEmail) {
        alert('変更後の新しい請求書送付用メールアドレスを入力してください。');
        return;
      }
      setAuthStep('waiting_invoice_email_2fa');
      alert(`【シミュレーション】新しい請求書送付用メールアドレス（ ${formData.newAccountingEmail} ）宛に二段階認証コード [ ${mockCode} ] を送信しました。`);
    }
  };

  const handleVerify2FA = async () => {
    if (verificationCodeInput.trim() !== mockSentCode) {
      alert('二段階認証コードが一致しません。正しいコードを入力してください。');
      return;
    }

    if (authType === 'email') {
      setAuthData(prev => ({ ...prev, email: authData.newEmail }));
      alert('メインメールアドレスの変更が完了しました！');
    } else if (authType === 'password') {
      setAuthData(prev => ({ ...prev, password: '••••••••', newPassword: '', confirmPassword: '' }));
      alert('パスワードの変更が完了しました！');
    } else if (authType === 'invoice_email') {
      setFormData(prev => ({ ...prev, accountingEmail: prev.newAccountingEmail }));
      alert('請求書送付用メールアドレスの変更が完了しました！');
      setEditContact(false);
    }
    setAuthStep('idle');
    setAuthType(null);
    setVerificationCodeInput('');
    setEditAuth(false);
  };

  const handleSaveSection = async (sectionName: string) => {
    if (sectionName === '事業・詳細情報') {
      if (!formData.businessPhone || !formData.businessEmail || !formData.postalCode || !formData.prefecture || !formData.city || !formData.addressSub || !formData.businessDescription) {
        alert('ホームページURL以外のすべての項目を入力してください。');
        return;
      }
    }

    alert(`${sectionName}を更新しました！`);
    if (sectionName === '基本情報') setEditBasic(false);
    if (sectionName === '連絡先情報') setEditContact(false);
    if (sectionName === '事業・詳細情報') setEditBusiness(false);
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
    <div style={{ minHeight: '90vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '60px 40px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1150px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* 上段：タイトルおよび登録された企業名・法人番号 */}
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

        {isAnyEditing && (
          <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', color: '#b45309', padding: '14px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>⚠️ 変更・二段階認証手続きが未完了です。手続きを完了してください。（完了するまで他画面へ移動できません）</span>
          </div>
        )}

        {/* ログイン情報セクション */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: editAuth ? '2px solid #166534' : '1px solid #e2e8f0', boxShadow: editAuth ? '0 10px 25px -5px rgba(22, 101, 52, 0.15)' : '0 4px 20px -2px rgba(0, 0, 0, 0.03)', overflow: 'hidden', transition: 'all 0.25s ease' }}>
          <div style={{ padding: '24px 32px', background: editAuth ? '#f0fdf4' : '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#166534' }}></div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>ログイン情報（メールアドレス・パスワード）</h3>
                {editAuth && <span style={{ fontSize: '11.5px', fontWeight: 'bold', color: '#166534' }}>✏️ 二段階認証によるセキュリティ変更モード中</span>}
              </div>
            </div>
            {!editAuth ? (
              <button onClick={() => setEditAuth(true)} style={{ background: '#166534', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>編集する</button>
            ) : (
              <button onClick={() => { setEditAuth(false); setAuthStep('idle'); }} style={{ background: '#cbd5e1', color: '#1e293b', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>キャンセル</button>
            )}
          </div>

          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {authStep === 'idle' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>メインメールアドレス (ログインID)</label>
                  <input type="email" value={authData.email} disabled style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f1f5f9', color: '#0f172a', fontSize: '14px', textAlign: 'left', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>パスワード</label>
                  <input type="password" value={authData.password} disabled style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f1f5f9', color: '#0f172a', fontSize: '14px', textAlign: 'left', boxSizing: 'border-box' }} />
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1.5px solid #166534' }}>
                {(authStep === 'waiting_email_2fa' || authStep === 'waiting_pass_2fa') && (
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#166534', margin: '0 0 8px 0' }}>📬 二段階認証コードの入力</h4>
                    <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 16px 0' }}>
                      {authStep === 'waiting_email_2fa' && `新メインアドレス（${authData.newEmail}）宛に送信された6桁のコードを入力してください。`}
                      {authStep === 'waiting_pass_2fa' && `現在のアドレス（${authData.email}）宛に送信された6桁のコードを入力してください。`}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <input type="text" placeholder="6桁のコードを入力" value={verificationCodeInput} onChange={e => setVerificationCodeInput(e.target.value)} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', textAlign: 'left', width: '220px' }} />
                      <button onClick={handleVerify2FA} style={{ background: '#166534', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>承認して変更を完了する</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {editAuth && authStep === 'idle' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}>新しいメインメールアドレスに変更</label>
                  <input type="email" name="newEmail" value={authData.newEmail} onChange={handleAuthChange} placeholder="新しいメールアドレス" style={getInputStyle(true)} />
                  <button onClick={() => handleRequestAuthUpdate('email')} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>新しいアドレスに二段階認証コード送信</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}>新しいパスワードに変更</label>
                  <input type="password" name="newPassword" value={authData.newPassword} onChange={handleAuthChange} placeholder="新しいパスワード（6文字以上）" style={getInputStyle(true)} />
                  <input type="password" name="confirmPassword" value={authData.confirmPassword} onChange={handleAuthChange} placeholder="新しいパスワード（確認用）" style={getInputStyle(true)} />
                  <button onClick={() => handleRequestAuthUpdate('password')} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>現在のメールに二段階認証コード送信</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 企業基本情報セクション */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: editBasic ? '2px solid #166534' : '1px solid #e2e8f0', boxShadow: editBasic ? '0 10px 25px -5px rgba(22, 101, 52, 0.15)' : '0 4px 20px -2px rgba(0, 0, 0, 0.03)', overflow: 'hidden', transition: 'all 0.25s ease' }}>
          <div style={{ padding: '24px 32px', background: editBasic ? '#f0fdf4' : '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#166534' }}></div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>企業基本情報</h3>
                {editBasic && <span style={{ fontSize: '11.5px', fontWeight: 'bold', color: '#166534' }}>✏️ 編集モード中</span>}
              </div>
            </div>
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
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: editBasic ? '#166534' : '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>インボイス登録番号</label>
              <input type="text" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} disabled={!editBasic} style={getInputStyle(editBasic)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: editBasic ? '#166534' : '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>代表者名</label>
              <input type="text" name="representativeName" value={formData.representativeName} onChange={handleChange} disabled={!editBasic} style={getInputStyle(editBasic)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: editBasic ? '#166534' : '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>許認可・資格の有無</label>
              <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} disabled={!editBasic} style={getInputStyle(editBasic)} />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: editBasic ? '#166534' : '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>資本金</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="text" name="capital" value={formData.capital} onChange={handleChange} placeholder="例: 10,000,000" disabled={!editBasic} style={getInputStyle(editBasic, true)} />
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#475569', whiteSpace: 'nowrap' }}>円</span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: editBasic ? '#166534' : '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>従業員数（正社員 / アルバイト・パート）</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input type="text" name="employeeRegular" value={formData.employeeRegular} onChange={handleChange} placeholder="正社員数" disabled={!editBasic} style={getInputStyle(editBasic, true)} />
                  <span style={{ fontSize: '12.5px', color: '#64748b', whiteSpace: 'nowrap' }}>名</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input type="text" name="employeePart" value={formData.employeePart} onChange={handleChange} placeholder="パート数" disabled={!editBasic} style={getInputStyle(editBasic, true)} />
                  <span style={{ fontSize: '12.5px', color: '#64748b', whiteSpace: 'nowrap' }}>名</span>
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: editBasic ? '#166534' : '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>設立日</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr auto', alignItems: 'center', gap: '6px' }}>
                <select name="establishYear" value={formData.establishYear} onChange={handleChange} disabled={!editBasic} style={getInputStyle(editBasic, true)}>
                  {Array.from({ length: 50 }, (_, i) => 2026 - i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <span style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>年</span>

                <select name="establishMonth" value={formData.establishMonth} onChange={handleChange} disabled={!editBasic} style={getInputStyle(editBasic, true)}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={String(m).padStart(2, '0')}>{m}</option>
                  ))}
                </select>
                <span style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>月</span>

                <select name="establishDay" value={formData.establishDay} onChange={handleChange} disabled={!editBasic} style={getInputStyle(editBasic, true)}>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={String(d).padStart(2, '0')}>{d}</option>
                  ))}
                </select>
                <span style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>日</span>
              </div>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: editBasic ? '#166534' : '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                業種・職種（複数選択可：現在 {formData.industry.length}件選択中）
              </label>
              <div style={{ maxHeight: '260px', overflowY: 'auto', border: editBasic ? '2px solid #166534' : '1px solid #cbd5e1', borderRadius: '10px', padding: '16px', background: editBasic ? '#fff' : '#f1f5f9', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {industryOptions.map((opt, i) => {
                  const isChecked = formData.industry.includes(opt);
                  return (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#0f172a', cursor: editBasic ? 'pointer' : 'default', userSelect: 'none' }}>
                      <input type="checkbox" checked={isChecked} onChange={() => editBasic && handleCheckboxChange(opt)} disabled={!editBasic} style={{ width: '16px', height: '16px', accentColor: '#166534', cursor: editBasic ? 'pointer' : 'default' }} />
                      {opt}
                    </label>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* 連絡先・経理担当者セクション */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: editContact ? '2px solid #166534' : '1px solid #e2e8f0', boxShadow: editContact ? '0 10px 25px -5px rgba(22, 101, 52, 0.15)' : '0 4px 20px -2px rgba(0, 0, 0, 0.03)', overflow: 'hidden', transition: 'all 0.25s ease' }}>
          <div style={{ padding: '24px 32px', background: editContact ? '#f0fdf4' : '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#166534' }}></div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>連絡先・経理担当者</h3>
                {editContact && <span style={{ fontSize: '11.5px', fontWeight: 'bold', color: '#166534' }}>✏️ 編集モード中</span>}
              </div>
            </div>
            {!editContact ? (
              <button onClick={() => { setEditContact(true); setFormData(prev => ({ ...prev, newAccountingEmail: prev.accountingEmail })); }} style={{ background: '#166534', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>編集する</button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleSaveSection('連絡先情報')} style={{ background: '#166534', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>変更を保存</button>
                <button onClick={() => setEditContact(false)} style={{ background: '#cbd5e1', color: '#1e293b', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>キャンセル</button>
              </div>
            )}
          </div>

          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: editContact ? '#166534' : '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ご担当者名</label>
                <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} disabled={!editContact} style={getInputStyle(editContact)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: editContact ? '#166534' : '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>経理ご担当者名 (部署名)</label>
                <input type="text" name="accountingContactName" value={formData.accountingContactName} onChange={handleChange} disabled={!editContact} style={getInputStyle(editContact)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: editContact ? '#166534' : '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>連絡先電話番号</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="例: 080-4276-2882" disabled={!editContact} style={getInputStyle(editContact)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: editContact ? '#166534' : '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>請求書送付用メールアドレス</label>
                <input type="email" name="accountingEmail" value={formData.accountingEmail} disabled style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f1f5f9', color: '#0f172a', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
            </div>

            {editContact && (
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1.5px dashed #166534', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}>請求書送付用メールアドレスの変更（要二段階認証）</label>
                
                {authStep !== 'waiting_invoice_email_2fa' ? (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input type="email" name="newAccountingEmail" value={formData.newAccountingEmail} onChange={handleChange} placeholder="新しい請求書送付用メールアドレス" style={{ ...getInputStyle(true), flex: 1 }} />
                    <button onClick={() => handleRequestAuthUpdate('invoice_email')} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '11px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}>新しいアドレスに二段階認証コード送信</button>
                  </div>
                ) : (
                  <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', border: '1.5px solid #166534', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#166534', margin: 0 }}>📬 新しい請求書送付用メールアドレス宛の二段階認証コード入力</h4>
                    <p style={{ fontSize: '12.5px', color: '#475569', margin: 0 }}>新アドレス（{formData.newAccountingEmail}）に送信された6桁の確認コードを入力してください。</p>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <input type="text" placeholder="6桁のコードを入力" value={verificationCodeInput} onChange={e => setVerificationCodeInput(e.target.value)} style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', width: '200px' }} />
                      <button onClick={handleVerify2FA} style={{ background: '#166534', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>承認して変更を完了する</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 事業・所在地詳細セクション */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: editBusiness ? '2px solid #166534' : '1px solid #e2e8f0', boxShadow: editBusiness ? '0 10px 25px -5px rgba(22, 101, 52, 0.15)' : '0 4px 20px -2px rgba(0, 0, 0, 0.03)', overflow: 'hidden', transition: 'all 0.25s ease' }}>
          <div style={{ padding: '24px 32px', background: editBusiness ? '#f0fdf4' : '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#166534' }}></div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>事業・所在地詳細</h3>
                {editBusiness && <span style={{ fontSize: '11.5px', fontWeight: 'bold', color: '#166534' }}>✏️ 編集モード中</span>}
              </div>
            </div>
            {!editBusiness ? (
              <button onClick={() => setEditBusiness(true)} style={{ background: '#166534', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>編集する</button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleSaveSection('事業・詳細情報')} style={{ background: '#166534', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>変更を保存</button>
                <button onClick={() => setEditBusiness(false)} style={{ background: '#cbd5e1', color: '#1e293b', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>キャンセル</button>
              </div>
            )}
          </div>

          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: editBusiness ? '#166534' : '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ホームページURL</label>
              <input type="text" name="homepageUrl" value={formData.homepageUrl} onChange={handleChange} disabled={!editBusiness} style={{ ...getInputStyle(editBusiness), width: '100%' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: editBusiness ? '#166534' : '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>電話番号 (必須)</label>
                <input type="text" name="businessPhone" value={formData.businessPhone} onChange={handleChange} placeholder="例: 022-000-0000" disabled={!editBusiness} style={getInputStyle(editBusiness)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: editBusiness ? '#166534' : '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>メールアドレス (必須)</label>
                <input type="email" name="businessEmail" value={formData.businessEmail} onChange={handleChange} placeholder="例: info@example.com" disabled={!editBusiness} style={getInputStyle(editBusiness)} />
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: editBusiness ? '1.5px solid #166534' : '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>拠点の種類 (必須)</label>
                <div style={{ display: 'flex', gap: '24px' }}>
                  {['本社', '支社・支店'].map((type) => (
                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: '600', color: '#0f172a', cursor: editBusiness ? 'pointer' : 'default' }}>
                      <input 
                        type="radio" 
                        name="branchType" 
                        value={type} 
                        checked={formData.branchType === type} 
                        onChange={handleChange} 
                        disabled={!editBusiness} 
                        style={{ accentColor: '#166534', width: '18px', height: '18px', cursor: editBusiness ? 'pointer' : 'default', margin: 0 }}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#166534', marginBottom: '6px' }}>本社の所在地 (必須)</label>
                <div style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '4px' }}>郵便番号（7桁入力で自動反映）</div>
                <input 
                  type="text" 
                  name="postalCode" 
                  value={formData.postalCode} 
                  onChange={(e) => handlePostalCodeChange(e.target.value)} 
                  placeholder="例: 9800021" 
                  disabled={!editBusiness} 
                  style={{ ...getInputStyle(editBusiness), maxWidth: '240px' }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '4px' }}>都道府県 (必須)</div>
                  <input 
                    type="text" 
                    name="prefecture" 
                    value={formData.prefecture} 
                    onChange={handleChange} 
                    placeholder="自動入力" 
                    disabled={!editBusiness} 
                    style={getInputStyle(editBusiness)} 
                  />
                </div>
                <div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '4px' }}>市区町村・町域 (必須)</div>
                  <input 
                    type="text" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange} 
                    placeholder="自動入力" 
                    disabled={!editBusiness} 
                    style={getInputStyle(editBusiness)} 
                  />
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '4px' }}>それ以降の住所（番地・ビル名など - 必須）</div>
                <input 
                  type="text" 
                  name="addressSub" 
                  value={formData.addressSub} 
                  onChange={handleChange} 
                  placeholder="例: 中央1-1-1" 
                  disabled={!editBusiness} 
                  style={getInputStyle(editBusiness)} 
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: editBusiness ? '#166534' : '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>事業内容 (必須)</label>
              <textarea name="businessDescription" value={formData.businessDescription} onChange={handleChange} disabled={!editBusiness} rows={4} style={{ ...getInputStyle(editBusiness), resize: 'vertical', lineHeight: '1.5' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: editBusiness ? '#ffffff' : '#f1f5f9', padding: '14px 18px', borderRadius: '10px', border: editBusiness ? '1.5px solid #166534' : '1px solid #cbd5e1' }}>
              <input type="checkbox" name="newsletter" id="newsletter" checked={formData.newsletter} onChange={handleChange} disabled={!editBusiness} style={{ width: '18px', height: '18px', accentColor: '#166534', cursor: editBusiness ? 'pointer' : 'default' }} />
              <label htmlFor="newsletter" style={{ fontSize: '13.5px', fontWeight: '600', color: '#0f172a', cursor: editBusiness ? 'pointer' : 'default' }}>メルマガ・お知らせ受領を希望する</label>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}