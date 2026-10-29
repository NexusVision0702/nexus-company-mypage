// app/applicants/page.tsx (With link on job title to jump to the job posting page)
'use client';

import React, { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

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

interface Applicant {
  id: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  jobTitle: string;
  jobId?: string; // 求人ID
  appliedDate: string;
  status: string;
  resumeSummary: string;
  showDmPrompt?: boolean;
}

const mainSteps = [
  '書類選考',
  'カジュアル面談',
  '一次面接',
  '二次面接',
  '最終面接',
  '内定'
];

const demoApplicants: Applicant[] = [
  {
    id: 'app_1',
    applicantName: '佐藤 健太',
    applicantEmail: 'sato.kenta@example.com',
    applicantPhone: '090-1234-5678',
    jobTitle: '【東北から世界へ・フルリモート可】フロントエンドテックリード候補',
    jobId: 'demo_job_1',
    appliedDate: '2026/06/07',
    status: '一次面接',
    resumeSummary: 'React / Next.js / TypeScriptを用いたWebアプリ開発経験5年。前職ではテックリードとしてデザインシステム構築を主導。',
    showDmPrompt: false
  },
  {
    id: 'app_2',
    applicantName: '鈴木 美咲',
    applicantEmail: 'suzuki.misaki@example.com',
    applicantPhone: '080-9876-5432',
    jobTitle: '【オープニングスタッフ募集】新規店舗の立ち上げ・店舗運営マネージャー候補',
    jobId: 'demo_job_2',
    appliedDate: '2026/06/05',
    status: '書類選考',
    resumeSummary: 'アパレル小売店での店長経験3年。スタッフ育成、数値管理、新規店舗立ち上げのマーケティング施策に強み。',
    showDmPrompt: false
  }
];

export default function ApplicantsPage() {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>(demoApplicants);
  const [statusFilter, setStatusFilter] = useState<string>('すべて');
  const [loading, setLoading] = useState<boolean>(true);

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

  const handleStatusChange = async (index: number, newStatus: string) => {
    const updated = [...applicants];
    const prevStatus = updated[index].status;
    
    updated[index].status = newStatus;
    
    if (prevStatus !== newStatus) {
      updated[index].showDmPrompt = true;
    }

    setApplicants(updated);
  };

  const handleDismissPrompt = (index: number) => {
    const updated = [...applicants];
    updated[index].showDmPrompt = false;
    setApplicants(updated);
  };

  const handleCreateDm = (index: number) => {
    handleDismissPrompt(index);
    window.location.href = '/dm';
  };

  const handleDeleteApplicant = async (appId: string, applicantName: string) => {
    const isConfirmed = window.confirm(`「${applicantName}さん」の応募者情報を本当に削除してもよろしいですか？\n※この操作は元に戻すことができません。`);
    
    if (!isConfirmed) return;

    if (appId.startsWith('app_')) {
      setApplicants(applicants.filter(app => app.id !== appId));
      alert('応募者情報を削除しました。');
      return;
    }

    try {
      await deleteDoc(doc(db, 'applicants', appId));
      setApplicants(applicants.filter(app => app.id !== appId));
      alert('応募者情報を削除しました。');
    } catch (e: any) {
      alert('削除に失敗しました: ' + e.message);
    }
  };

  const handleOpenMyPage = (applicantId: string) => {
    window.location.href = `/applicants/detail?id=${applicantId}`;
  };

  // 掲載求人ページへ飛ぶ処理
  const handleOpenJobPosting = (jobId?: string) => {
    if (jobId && !jobId.startsWith('demo_')) {
      window.location.href = `/jobs/new?id=${jobId}`;
    } else {
      // デモ求人の場合やIDがない場合は求人一覧ページへ遷移
      window.location.href = '/jobs';
    }
  };

  const filteredApplicants = applicants.filter(app => {
    return statusFilter === 'すべて' || app.status === statusFilter;
  });

  if (loading) return <div style={{ padding: '80px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>読み込み中...</div>;

  return (
    <div style={{ minHeight: '90vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '40px 40px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* ヘッダーエリア */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#059669', marginBottom: '6px' }}>
              SETTINGS / APPLICANTS
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              応募者履歴・選考管理
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>選考ステップ絞り込み:</span>
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '9px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff', fontWeight: '700', color: '#0f172a', outline: 'none' }}
            >
              <option value="すべて">すべて</option>
              {mainSteps.map((st, i) => (
                <option key={i} value={st}>{st}</option>
              ))}
              <option value="見送り">見送り</option>
            </select>
          </div>
        </div>

        {/* メインカードコンテナ */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
          
          <div style={{ padding: '20px 28px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              応募者一覧 <span style={{ color: '#059669' }}>({filteredApplicants.length}名)</span>
            </h3>
          </div>

          <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {filteredApplicants.length === 0 ? (
              <div style={{ color: '#64748b', fontSize: '14px', fontStyle: 'italic', padding: '40px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                該当する応募者はいません。
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredApplicants.map((app) => {
                  const originalIndex = applicants.findIndex(a => a.id === app.id);
                  const currentStepIndex = mainSteps.indexOf(app.status);
                  const isRejected = app.status === '見送り';

                  return (
                    <div key={app.id} style={{ background: '#f8fafc', padding: '28px', borderRadius: '16px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '20px', transition: 'all 0.2s' }}>
                      
                      {/* 上段：応募者名・応募日・各種ボタン */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <h4 
                            onClick={() => handleOpenMyPage(app.id)}
                            title="クリックして求職者マイページ・詳細を確認"
                            style={{ 
                              fontSize: '17px', 
                              fontWeight: '900', 
                              color: '#059669', 
                              margin: 0, 
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              textDecoration: 'underline'
                            }}
                          >
                            {app.applicantName} さん <span style={{ fontSize: '12px', color: '#047857' }}>🔗 マイページ確認</span>
                          </h4>

                          <span style={{ fontSize: '12px', color: '#64748b', background: '#ffffff', border: '1px solid #cbd5e1', padding: '3px 10px', borderRadius: '6px', fontWeight: '700' }}>
                            応募日: {app.appliedDate}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <button 
                            type="button"
                            onClick={() => handleStatusChange(originalIndex, isRejected ? '書類選考' : '見送り')}
                            style={{ 
                              background: isRejected ? '#fee2e2' : '#f1f5f9', 
                              color: isRejected ? '#dc2626' : '#64748b', 
                              border: isRejected ? '1px solid #fca5a5' : '1px solid #cbd5e1', 
                              padding: '8px 16px', 
                              borderRadius: '8px', 
                              fontSize: '12.5px', 
                              fontWeight: '800', 
                              cursor: 'pointer' 
                            }}
                          >
                            {isRejected ? '⚠️ 見送り (解除する)' : '🚫 見送りにする'}
                          </button>

                          <button 
                            onClick={() => handleCreateDm(originalIndex)}
                            style={{ background: '#059669', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 8px rgba(5, 150, 105, 0.2)' }}
                          >
                            DMを送る ✉️
                          </button>

                          <button 
                            onClick={() => handleDeleteApplicant(app.id, app.applicantName)}
                            style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', padding: '9px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
                          >
                            削除 🗑️
                          </button>
                        </div>
                      </div>

                      {/* ステータス変更時のDM案内バナー */}
                      {app.showDmPrompt && (
                        <div style={{ 
                          background: isRejected ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' : 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', 
                          border: isRejected ? '2px solid #dc2626' : '2px solid #059669', 
                          padding: '16px 22px', 
                          borderRadius: '12px', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          boxShadow: isRejected ? '0 6px 20px rgba(220, 38, 38, 0.15)' : '0 6px 20px rgba(5, 150, 105, 0.15)',
                          position: 'relative',
                          gap: '12px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, paddingRight: '24px' }}>
                            <span style={{ fontSize: '20px' }}>📢</span>
                            <span style={{ fontSize: '14px', fontWeight: '900', color: isRejected ? '#991b1b' : '#064e3b', letterSpacing: '-0.01em' }}>
                              ステータスが「<span style={{ color: isRejected ? '#dc2626' : '#047857', textDecoration: 'underline' }}>{app.status}</span>」に変更されました。応募者に{isRejected ? 'お見送り' : '選考通過'}DMをお送りください！
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <button 
                              onClick={() => handleCreateDm(originalIndex)}
                              style={{ 
                                background: isRejected ? '#dc2626' : '#059669', 
                                color: '#fff', 
                                border: 'none', 
                                padding: '10px 20px', 
                                borderRadius: '8px', 
                                fontSize: '13.5px', 
                                fontWeight: '900', 
                                cursor: 'pointer', 
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                                whiteSpace: 'nowrap' 
                              }}
                            >
                              DMを作成する ➔
                            </button>

                            <button 
                              onClick={() => handleDismissPrompt(originalIndex)}
                              title="閉じる"
                              style={{ 
                                background: 'transparent', 
                                border: 'none', 
                                color: isRejected ? '#991b1b' : '#047857', 
                                fontSize: '18px', 
                                fontWeight: '900', 
                                cursor: 'pointer', 
                                padding: '4px 8px',
                                borderRadius: '4px'
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )}

                      {/* 中段：選考ステージ（スライドバー） */}
                      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#0f172a' }}>
                            選考ステージ
                          </span>
                          <span style={{ fontSize: '12.5px', fontWeight: '900', color: isRejected ? '#dc2626' : '#059669', background: isRejected ? '#fef2f2' : '#ecfdf5', border: isRejected ? '1px solid #fecaca' : '1px solid #a7f3d0', padding: '2px 12px', borderRadius: '6px' }}>
                            現在: {app.status}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '100%', padding: '10px 0' }}>
                          <div style={{ position: 'absolute', top: '50%', left: '20px', right: '20px', height: '4px', background: '#e2e8f0', transform: 'translateY(-50%)', zIndex: '1' }}></div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', position: 'relative', zIndex: 2 }}>
                            {mainSteps.map((step, sIdx) => {
                              const isPassed = !isRejected && currentStepIndex >= sIdx;
                              const isCurrent = !isRejected && app.status === step;

                              return (
                                <div 
                                  key={sIdx} 
                                  onClick={() => handleStatusChange(originalIndex, step)}
                                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: '8px' }}
                                >
                                  <div style={{
                                    width: isCurrent ? '32px' : '26px',
                                    height: isCurrent ? '32px' : '26px',
                                    borderRadius: '50%',
                                    background: isCurrent ? '#059669' : (isPassed ? '#10b981' : '#ffffff'),
                                    border: isCurrent ? '4px solid #d1fae5' : (isPassed ? '2px solid #10b981' : '2px solid #cbd5e1'),
                                    color: isPassed || isCurrent ? '#ffffff' : '#64748b',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: '900',
                                    boxShadow: isCurrent ? '0 0 15px rgba(5, 150, 105, 0.4)' : 'none',
                                    transition: 'all 0.2s'
                                  }}>
                                    {sIdx + 1}
                                  </div>
                                  <span style={{
                                    fontSize: '11.5px',
                                    fontWeight: isCurrent ? '900' : '700',
                                    color: isCurrent ? '#059669' : '#475569',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    {step}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                        </div>

                      </div>

                      {/* 詳細情報：応募求人（クリックで求人ページへ遷移） ＆ 連絡先 */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13.5px', color: '#475569' }}>
                        <div>
                          <strong style={{ color: '#0f172a' }}>応募求人:</strong>{' '}
                          <span 
                            onClick={() => handleOpenJobPosting(app.jobId)}
                            title="クリックして掲載求人を確認・編集"
                            style={{ 
                              color: '#059669', 
                              fontWeight: '700', 
                              cursor: 'pointer',
                              textDecoration: 'underline'
                            }}
                          >
                            {app.jobTitle} 🔗
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                          <div><strong style={{ color: '#0f172a' }}>メール:</strong> {app.applicantEmail}</div>
                          <div><strong style={{ color: '#0f172a' }}>電話番号:</strong> {app.applicantPhone}</div>
                        </div>
                      </div>

                      {/* 下段：レジュメ概要 */}
                      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '14px 18px', borderRadius: '10px' }}>
                        <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>📋 経歴・プロフィール概要</span>
                        <p style={{ fontSize: '13.5px', color: '#334155', margin: 0, lineHeight: '1.6' }}>
                          {app.resumeSummary}
                        </p>
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