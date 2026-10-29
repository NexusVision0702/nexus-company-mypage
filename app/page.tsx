// app/page.tsx (Dashboard with Schedule Detail linking to Applicants page)
'use client';

import React, { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { CompanyData } from '../types/company';
import Link from 'next/link';

const firebaseConfig = {
  apiKey: "AIzaSyCTI6ZylCTzLGXxnuLVlQb1ccmhUAMpxm0",
  authDomain: "nexus-job-board-d042c.firebaseapp.com",
  projectId: "nexus-job-board-d042c",
  storageBucket: "nexus-job-board-d042c.firebasestorage.app",
  messagingSenderId: "266729846625",
  appId: "1:266729846625:web:b5f7296cc7bae2017e3720",
  measurementId: "G-ZML9CWEG75"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default function CompanyMyPage() {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [currentCompany, setCurrentCompany] = useState<CompanyData | null>(null);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'companies'));
      const list: CompanyData[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as CompanyData);
      });
      setCompanies(list);
    } catch (e: any) {
      console.error('データ取得エラー:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (companies.length > 0) {
      const savedId = localStorage.getItem('nexus_company_id');
      if (savedId) {
        const found = companies.find(c => c.id === savedId);
        if (found) {
          setCurrentCompany(found);
        }
      }
    }
  }, [companies]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = companies.find(c => c.email?.toLowerCase() === loginEmail.trim().toLowerCase());
    if (found) {
      setCurrentCompany(found);
      localStorage.setItem('nexus_company_id', found.id);
    } else {
      alert('該当するメールアドレスの企業が見つかりませんでした。');
    }
  };

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>データ読み込み中...</div>;
  }

  // 未ログイン：ログイン画面
  if (!currentCompany) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', padding: '20px', boxSizing: 'border-box' }}>
        <div style={{ background: '#ffffff', padding: '48px 40px', borderRadius: '20px', boxShadow: '0 20px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '440px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>PARTNER PORTAL</span>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '16px 0 8px 0' }}>企業マイページログイン</h1>
            <p style={{ fontSize: '13px', color: '#64748b' }}>ご登録いただいている担当者メールアドレスを入力してください。</p>
          </div>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="example@company.co.jp" required style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }} />
            <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>ログインする</button>
          </form>
        </div>
      </div>
    );
  }

  const jobs = currentCompany.jobs || [];
  const companyViews = (currentCompany as any).companyViewsCount || 124;
  const currentStatus = { text: currentCompany.status === 'approved' ? '承認済み（公開中）' : '審査待ち', color: currentCompany.status === 'approved' ? '#166534' : '#b45309' };

  let filledFields = 0;
  const totalFields = 8;
  if (currentCompany.representativeName) filledFields++;
  if (currentCompany.contactName) filledFields++;
  if (currentCompany.phone) filledFields++;
  if (currentCompany.businessDescription) filledFields++;
  if (currentCompany.invoiceNumber) filledFields++;
  if (currentCompany.capital) filledFields++;
  if (currentCompany.address) filledFields++;
  if (currentCompany.accountingEmail) filledFields++;
  const profileCompleteness = Math.round((filledFields / totalFields) * 100);

  const upcomingInterviews = [
    { id: 1, title: '【Aさん】一次面接・カジュアル面談', datetime: '10月11日(日) 14:00〜15:00', status: '確定' },
    { id: 2, title: '【Bさん】最終面接', datetime: '10月14日(水) 11:00〜12:00', status: '調整中' }
  ];

  const quickLinks = [
    { title: '求人の効果的な書き方ガイド', desc: 'PV数を伸ばすためのコツやタイトルの付け方を解説', icon: '📝', href: '/jobs' },
    { title: '請求書発行・経理設定の手順', desc: '毎月の締め日やインボイス制度対応について', icon: '💰', href: '/accounting' },
    { title: '応募者対応マニュアル', desc: 'DMの返信テンプレートや面談調整の流れ', icon: '🤝', href: '/dm' },
    { title: '運営事務局へのお問い合わせ', desc: 'お困りごとやご不明点をチャットですぐに質問', icon: '💬', href: '/support' }
  ];

  const announcements = [
    { id: 1, date: '2026-06-01', title: '【重要】新機能「ダイレクトメッセージ(DM)」リリースのお知らせ', tag: '重要' },
    { id: 2, date: '2026-05-20', title: '夏季期間中の求人掲載プランおよびサポート窓口の営業時間について', tag: 'お知らせ' },
  ];

  return (
    <div style={{ minHeight: '80vh', background: '#f8fafc', fontFamily: 'sans-serif', padding: '40px 0', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* 上段：主要メトリクス */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold', marginBottom: '8px' }}>アカウント状態</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: currentStatus.color }}>{currentStatus.text}</div>
            </div>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold', marginBottom: '8px' }}>企業ページの閲覧数</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2563eb' }}>{companyViews.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#64748b' }}>PV</span></div>
            </div>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold', marginBottom: '8px' }}>プロフィール完成度</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: profileCompleteness === 100 ? '#16a34a' : '#d97706' }}>{profileCompleteness}%</div>
            </div>
          </div>

          {/* 中段2カラム：掲載中求人サマリー ＆ 直近スケジュール */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            
            {/* 掲載中求人サマリー */}
            <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>📋 掲載中求人サマリー ({jobs.length}件)</h3>
                <Link href="/jobs" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none', fontWeight: 'bold' }}>すべて見る →</Link>
              </div>
              {jobs.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '13.5px', fontStyle: 'italic' }}>現在作成されている求人はありません。</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {jobs.slice(0, 3).map((job: any) => (
                    <div key={job.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '10px', background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{job.employmentType}</span>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a', marginTop: '4px' }}>{job.title}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>💰 {job.salary}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>閲覧数</div>
                        <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#16a34a' }}>{job.viewsCount || 48} PV</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 直近スケジュールカード（「詳細 →」で応募者履歴ページへ遷移） */}
            <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>📅 直近の面談・面接スケジュール</h3>
                <Link href="/applicants" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none', fontWeight: 'bold' }}>
                  詳細 →
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {upcomingInterviews.map((interview) => (
                  <div key={interview.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: interview.status === '確定' ? '#166534' : '#b45309', background: interview.status === '確定' ? '#dcfce7' : '#fef3c7', padding: '2px 6px', borderRadius: '4px' }}>{interview.status}</span>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb' }}>{interview.datetime}</span>
                    </div>
                    <div style={{ fontSize: '13.5px', fontWeight: 'bold', color: '#0f172a' }}>{interview.title}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* よくある質問（FAQ）やマニュアルへのクイックリンク */}
          <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>💡 よくある質問・お役立ちマニュアル</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              {quickLinks.map((link, idx) => (
                <Link key={idx} href={link.href} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', height: '100%', boxSizing: 'border-box', transition: 'all 0.2s ease', cursor: 'pointer' }}>
                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>{link.icon}</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}>{link.title}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>{link.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 下段：運営事務局からの重要なお知らせ */}
          <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>📢 運営事務局からの重要なお知らせ</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {announcements.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '6px', background: item.tag === '重要' ? '#fee2e2' : '#e2e8f0', color: item.tag === '重要' ? '#991b1b' : '#334155' }}>
                      {item.tag}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{item.title}</span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>{item.date}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}