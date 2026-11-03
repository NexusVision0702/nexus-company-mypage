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

export default function CompanyOverviewPage() {
  const [loading, setLoading] = useState<boolean>(true);

  const [editAuth, setEditAuth] = useState<boolean>(false);
  const [editBasic, setEditBasic] = useState<boolean>(false);
  const [editContact, setEditContact] = useState<boolean>(false);
  const [editBusiness, setEditBusiness] = useState<boolean>(false);

  const [authData, setAuthData] = useState({
    email: '',
    newEmail: '',
    password: '••••••••',
    newPassword: '',
    confirmPassword: ''
  });

  const [authStep, setAuthStep] = useState<'idle' | 'waiting_email_2fa' | 'waiting_pass_2fa' | 'waiting_invoice_email_2fa'>('idle');
  const [authType, setAuthType] = useState<'email' | 'password' | 'invoice_email' | null>(null);
  const [verificationCodeInput, setVerificationCodeInput] = useState('');
  const [mockSentCode, setMockSentCode] = useState('');

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

  // 本番環境用：ログイン中の企業データを動的に取得する
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const getCookie = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(';').shift();
        };

        // クッキーまたはローカルストレージからログイン中の企業IDを取得
        const companyId = getCookie('nexus_company_id') || localStorage.getItem('nexus_company_id');

        if (!companyId) {
          // 未認証の場合はログイン画面へ強制送還
          window.location.href = '/login';
          return;
        }

        const res = await fetch(`/api/company?companyId=${companyId}`);
        
        if (res.status === 401 || res.status === 403) {
          alert('セッションの有効期限が切れています。再度ログインしてください。');
          window.location.href = '/login';
          return;
        }

        if (res.ok) {
          const data = await res.json();
          if (data && data.company) {
            const comp = data.company;
            
            const userEmail = comp.email || comp.contactEmail || comp.businessEmail || '';
            setAuthData(prev => ({
              ...prev,
              email: userEmail,
              newEmail: userEmail
            }));

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
              phone: comp.phone || '',
              accountingEmail: comp.accountingEmail || comp.email || '',
              newAccountingEmail: comp.accountingEmail || comp.email || '',
              homepageUrl: comp.homepageUrl || '',
              branchType: comp.branchType || '本社',
              postalCode: comp.postalCode || '',
              prefecture: comp.prefecture || '',
              city: comp.city || '',
              addressSub: comp.addressSub || '',
              businessPhone: comp.businessPhone || comp.phone || '',
              businessEmail: comp.businessEmail || comp.email || '',
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthData({ ...authData, [e.target.name]: e.target.value });
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

  const handleRequestAuthUpdate = (type: 'email' | 'password' | 'invoice_email') => {
    setAuthType(type);
    const mockCode = String(Math.floor(100000 + Math.random() * 900000));
    setMockSentCode(mockCode);

    if (type === 'email') {
      setAuthStep('waiting_email_2fa');
      alert(`【シミュレーション】新アドレス宛に認証コード [ ${mockCode} ] を送信しました。`);
    } else if (type === 'password') {
      setAuthStep('waiting_pass_2fa');
      alert(`【シミュレーション】現在のアドレス宛に認証コード [ ${mockCode} ] を送信しました。`);
    } else if (type === 'invoice_email') {
      setAuthStep('waiting_invoice_email_2fa');
      alert(`【シミュレーション】新請求書アドレス宛に認証コード [ ${mockCode} ] を送信しました。`);
    }
  };

  const handleVerify2FA = async () => {
    if (verificationCodeInput.trim() !== mockSentCode) {
      alert('二段階認証コードが一致しません。');
      return;
    }
    alert('変更が完了しました！');
    setAuthStep('idle');
    setAuthType(null);
    setVerificationCodeInput('');
    setEditAuth(false);
  };

  const handleSaveSection = async (sectionName: string) => {
    try {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
      };
      const companyId = getCookie('nexus_company_id') || localStorage.getItem('nexus_company_id');

      if (!companyId) {
        alert('認証情報が見つかりません。再度ログインしてください。');
        window.location.href = '/login';
        return;
      }

      const res = await fetch('/api/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, ...formData }),
      });

      if (res.ok) {
        alert(`${sectionName}を更新しました！`);
        if (sectionName === '基本情報') setEditBasic(false);
        if (sectionName === '連絡先情報') setEditContact(false);
        if (sectionName === '事業・詳細情報') setEditBusiness(false);
      } else {
        const errData = await res.json();
        alert(`保存に失敗しました: ${errData.error || '不明なエラー'}`);
      }
    } catch (e: any) {
      alert(`通信エラーが発生しました: ${e.message}`);
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
    <div style={{ minHeight: '90vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '60px 40px', boxSizing: 'border-box' }}>
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
        <div style={{ background: '#ffffff', borderRadius: '16px', border: editAuth ? '2px solid #166534' : '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '24px 32px', background: editAuth ? '#f0fdf4' : '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>ログイン情報（メールアドレス・パスワード）</h3>
            {!editAuth ? (
              <button onClick={() => setEditAuth(true)} style={{ background: '#166534', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>編集する</button>
            ) : (
              <button onClick={() => { setEditAuth(false); setAuthStep('idle'); }} style={{ background: '#cbd5e1', color: '#1e293b', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>キャンセル</button>
            )}
          </div>
          <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>メインメールアドレス (ログインID)</label>
              <input type="email" value={authData.email} disabled style={getInputStyle(false)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>パスワード</label>
              <input type="password" value={authData.password} disabled style={getInputStyle(false)} />
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
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>ご担当者名</label>
              <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} disabled={!editContact} style={getInputStyle(editContact)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>経理ご担当者名 (部署名)</label>
              <input type="text" name="accountingContactName" value={formData.accountingContactName} onChange={handleChange} disabled={!editContact} style={getInputStyle(editContact)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>連絡先電話番号</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} disabled={!editContact} style={getInputStyle(editContact)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>請求書送付用メールアドレス</label>
              <input type="email" name="accountingEmail" value={formData.accountingEmail} onChange={handleChange} disabled={!editContact} style={getInputStyle(editContact)} />
            </div>
          </div>
        </div>

        {/* 事業・所在地詳細セクション */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: editBusiness ? '2px solid #166534' : '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '24px 32px', background: editBusiness ? '#f0fdf4' : '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>事業・所在地詳細</h3>
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
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>ホームページURL</label>
              <input type="text" name="homepageUrl" value={formData.homepageUrl} onChange={handleChange} disabled={!editBusiness} style={getInputStyle(editBusiness)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>電話番号 (必須)</label>
                <input type="text" name="businessPhone" value={formData.businessPhone} onChange={handleChange} disabled={!editBusiness} style={getInputStyle(editBusiness)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>メールアドレス (必須)</label>
                <input type="email" name="businessEmail" value={formData.businessEmail} onChange={handleChange} disabled={!editBusiness} style={getInputStyle(editBusiness)} />
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