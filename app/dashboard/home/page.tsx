// app/dashboard/home/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { CompanyData } from '../../../types/company';
import Link from 'next/link';

export default function HomeDashboard() {
  const [currentCompany, setCurrentCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoading(true);
      try {
        const savedId = localStorage.getItem('nexus_company_id');
        const targetId = savedId || 'comp_1793266043558';

        const res = await fetch(`/api/company?companyId=${targetId}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.company) {
            setCurrentCompany(data.company as any);
            setLoading(false);
            return;
          }
        }

        // フォールバック
        setCurrentCompany({
          id: targetId,
          email: 'yoshihisahasama@gmail.com',
          representativeName: '挾間 義尚',
          contactName: '挾間 義尚',
          phone: '090-0000-0000',
          businessDescription: '総合人材サービス・求人プラットフォーム運営',
          invoiceNumber: 'T1234567890123',
          capital: '1000万円',
          address: '宮城県仙台市',
          accountingEmail: 'accounting@nexus-vision.net',
          status: 'approved',
          jobs: [
            {
              id: 'demo_job_1',
              employmentType: '正社員',
              title: '【東北から世界へ・フルリモート可】フロントエンドテックリード候補',
              salary: '月給 45万円 〜 70万円',
              viewsCount: 148
            },
            {
              id: 'demo_job_2',
              employmentType: '契約社員',
              title: '【オープニングスタッフ募集】新規店舗の立ち上げ・店舗運営マネージャー候補',
              salary: '月給 32万円 〜 45万円',
              viewsCount: 92
            }
          ]
        } as any);
      } catch (e) {
        console.error('データ取得エラー:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>データ読み込み中...</div>;
  }

  if (!currentCompany) {
    return null;
  }

  const jobs = (currentCompany as any).jobs || [];
  const companyViews = (currentCompany as any).companyViewsCount || 124;
  const currentStatus = { 
    text: (currentCompany as any).status === 'approved' ? '承認済み（公開中）' : '審査待ち', 
    color: (currentCompany as any).status === 'approved' ? '#166534' : '#b45309' 
  };

  let filledFields = 0;
  const totalFields = 8;
  if (currentCompany.representativeName) filledFields++;
  if (currentCompany.contactName) filledFields++;
  if (currentCompany.phone) filledFields++;
  if ((currentCompany as any).businessDescription) filledFields++;
  if (currentCompany.invoiceNumber) filledFields++;
  if (currentCompany.capital) filledFields++;
  if (currentCompany.address) filledFields++;
  if ((currentCompany as any).accountingEmail) filledFields++;
  const profileCompleteness = Math.round((filledFields / totalFields) * 100);

  const upcomingInterviews = [
    { id: 1, title: '【Aさん】一次面接・カジュアル面談', datetime: '10月11日(日) 14:00〜15:00', status: '確定' },
    { id: 2, title: '【Bさん】最終面接', datetime: '10月14日(水) 11:00〜12:00', status: '調整中' }
  ];

  const quickLinks = [
    { title: '求人の効果的な書き方ガイド', desc: 'PV数を伸ばすためのコツやタイトルの付け方を解説', icon: '📝', href: '/dashboard/jobs' },
    { title: '請求書発行・経理設定の手順', desc: '毎月の締め日やインボイス制度対応について', icon: '💰', href: '/dashboard/overview' },
    { title: '応募者対応マニュアル', desc: 'DMの返信テンプレートや面談調整の流れ', icon: '🤝', href: '/dashboard/applicants' },
    { title: '運営事務局へのお問い合わせ', desc: 'お困りごとやご不明点をチャットですぐに質問', icon: '💬', href: '/dashboard/support' }
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
                <Link href="/dashboard/jobs" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none', fontWeight: 'bold' }}>すべて見る →</Link>
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

            {/* 直近スケジュールカード */}
            <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>📅 直近の面談・面接スケジュール</h3>
                <Link href="/dashboard/applicants" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none', fontWeight: 'bold' }}>
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

          {/* よくある質問・お役立ちマニュアル */}
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

          {/* 運営事務局からの重要なお知らせ */}
          <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>📢 運営事務局からの重要なお知らせ</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {announcements.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '6px', background: item.tag === '重要' ? '#fee2e2' : '#e2e8f0', color: item.tag === '重要' ? '#991b1b' : '#334155' }}>
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