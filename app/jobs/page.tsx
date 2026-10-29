// app/jobs/page.tsx (Status options limited to 公開中 and 停止中)
'use client';

import React, { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

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

interface JobItem {
  id: string;
  title: string;
  employmentType: string;
  salary: string;
  location: string;
  plan: string;
  duration: string;
  createdAt: string;
  startDate: string;
  endDate: string;
  viewCount: number;
  applicantCount: number;
  status: string;
  postingLocationInfo?: {
    name: string;
    address: string;
  };
}

const calculatePeriod = (createdAtStr: string, durationStr: string) => {
  try {
    const start = createdAtStr ? new Date(createdAtStr) : new Date();
    if (isNaN(start.getTime())) {
      start.setTime(Date.now());
    }
    const match = durationStr.match(/(\d+)/);
    const weeks = match ? parseInt(match[1], 10) : 2;
    const end = new Date(start);
    end.setDate(end.getDate() + weeks * 7);

    const formatDate = (d: Date) => `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
    return {
      start: formatDate(start),
      end: formatDate(end)
    };
  } catch (e) {
    return { start: '2026/06/01', end: '2026/06/15' };
  }
};

const demoJobs: JobItem[] = [
  {
    id: 'demo_job_1',
    title: '【東北から世界へ・フルリモート可】自社SaaSプロダクトを牽引するフロントエンドテックリード候補',
    employmentType: '正社員',
    salary: '年収 6,500,000円 〜 10,000,000円',
    location: '宮城県仙台市宮城野区榴岡1-2-3 仙台ITビル 5F',
    plan: 'Sプラン (200,000円/週間)',
    duration: '2週間',
    createdAt: '2026-06-01',
    startDate: '2026/06/01',
    endDate: '2026/06/15',
    viewCount: 142,
    applicantCount: 5,
    status: '公開中',
    postingLocationInfo: {
      name: '本社',
      address: '宮城県仙台市宮城野区岩切1-1-1'
    }
  },
  {
    id: 'demo_job_2',
    title: '【オープニングスタッフ募集】新規店舗の立ち上げ・店舗運営マネージャー候補',
    employmentType: '正社員',
    salary: '月給 350,000円 〜 500,000円',
    location: '宮城県仙台市青葉区中央1-1-1',
    plan: 'Aプラン (100,000円/週間)',
    duration: '1週間',
    createdAt: '2026-06-05',
    startDate: '2026/06/05',
    endDate: '2026/06/12',
    viewCount: 88,
    applicantCount: 2,
    status: '停止中',
    postingLocationInfo: {
      name: '岩切店',
      address: '宮城県仙台市宮城野区岩切1-1-1'
    }
  }
];

export default function JobsPage() {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [jobs, setJobs] = useState<JobItem[]>([]);

  // 絞り込み用のステート（選択式）
  const [selectedTitle, setSelectedTitle] = useState<string>('すべて');
  const [selectedLocation, setSelectedLocation] = useState<string>('すべて');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<string>('すべて');
  const [selectedPlan, setSelectedPlan] = useState<string>('すべて');
  const [statusFilter, setStatusFilter] = useState<string>('すべて');

  useEffect(() => {
    const id = localStorage.getItem('nexus_company_id');
    if (!id) {
      localStorage.setItem('nexus_company_id', 'demo_company_001');
      setCompanyId('demo_company_001');
      setJobs(demoJobs);
      setLoading(false);
      return;
    }
    setCompanyId(id);
    fetchJobs(id);
  }, []);

  const fetchJobs = async (cId: string) => {
    try {
      const q = query(collection(db, 'jobs'), where('companyId', '==', cId));
      const querySnapshot = await getDocs(q);
      const loadedJobs: JobItem[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || '2026-06-01');
        const duration = data.duration || '2週間';
        const period = calculatePeriod(createdAt, duration);

        loadedJobs.push({
          id: docSnap.id,
          title: data.title || '',
          employmentType: data.employmentType || '正社員',
          salary: data.salary || '',
          location: data.location || '住所未登録',
          plan: data.plan || 'Sプラン (200,000円/週間)',
          duration: duration,
          createdAt: createdAt,
          startDate: period.start,
          endDate: period.end,
          viewCount: data.viewCount || 12,
          applicantCount: data.applicantCount || 1,
          status: data.status === '停止中' ? '停止中' : '公開中',
          postingLocationInfo: data.postingLocationInfo || { name: '本社', address: '' }
        });
      });

      if (loadedJobs.length === 0) {
        setJobs(demoJobs);
      } else {
        setJobs(loadedJobs);
      }
    } catch (e) {
      console.error('求人取得エラー:', e);
      setJobs(demoJobs);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (index: number, newStatus: string) => {
    const updated = [...jobs];
    updated[index].status = newStatus;
    setJobs(updated);

    const job = updated[index];
    if (job.id.startsWith('demo_')) return;

    try {
      await updateDoc(doc(db, 'jobs', job.id), { status: newStatus });
    } catch (e: any) {
      console.error('ステータス更新失敗:', e.message);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('この求人を削除してもよろしいですか？')) return;
    if (id.startsWith('demo_')) {
      setJobs(jobs.filter(job => job.id !== id));
      alert('デモ求人を削除しました。');
      return;
    }
    try {
      await deleteDoc(doc(db, 'jobs', id));
      setJobs(jobs.filter(job => job.id !== id));
      alert('求人を削除しました。');
    } catch (e: any) {
      alert('削除失敗: ' + e.message);
    }
  };

  // 選択肢用のユニークなリストを生成
  const uniqueTitles = Array.from(new Set(jobs.map(job => job.title)));
  const uniqueLocations = Array.from(new Set(jobs.map(job => job.location)));
  const uniqueEmploymentTypes = Array.from(new Set(jobs.map(job => job.employmentType)));
  const uniquePlans = Array.from(new Set(jobs.map(job => job.plan)));

  // フィルタリング処理
  const filteredJobs = jobs.filter(job => {
    const matchesTitle = selectedTitle === 'すべて' || job.title === selectedTitle;
    const matchesLocation = selectedLocation === 'すべて' || job.location === selectedLocation;
    const matchesEmploymentType = selectedEmploymentType === 'すべて' || job.employmentType === selectedEmploymentType;
    const matchesPlan = selectedPlan === 'すべて' || job.plan === selectedPlan;
    const matchesStatus = statusFilter === 'すべて' || job.status === statusFilter;

    return matchesTitle && matchesLocation && matchesEmploymentType && matchesPlan && matchesStatus;
  });

  if (loading) return <div style={{ padding: '80px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>読み込み中...</div>;

  return (
    <div style={{ minHeight: '90vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '60px 40px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1150px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* ページヘッダー */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e2e8f0', paddingBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#059669', marginBottom: '6px' }}>RECRUITMENT / MANAGEMENT</div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>求人作成・プラン選択</h1>
          </div>
        </div>

        {/* プロモーションバナー */}
        <div style={{ background: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #047857 100%)', borderRadius: '24px', padding: '48px 56px', color: '#ffffff', boxShadow: '0 25px 50px -12px rgba(6, 78, 59, 0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 1, maxWidth: '680px' }}>
            <h2 style={{ fontSize: '27px', fontWeight: '900', margin: 0, letterSpacing: '-0.015em', lineHeight: '1.3', color: '#ffffff', textShadow: '0 2px 4px rgba(0, 0, 0, 0.25)', whiteSpace: 'nowrap' }}>
              あなたの会社の未来を変える、<span style={{ color: '#f97316' }}>運命の仲間</span>に出会おう。
            </h2>
            <p style={{ fontSize: '14.5px', margin: 0, fontWeight: '500', lineHeight: '1.6', color: '#f1f5f9', whiteSpace: 'nowrap', textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>
              企業のビジョンと情熱を最高のストーリーとして届け、今すぐプレミアムな採用活動をスタートさせましょう。
            </p>
          </div>
          
          <div style={{ zIndex: 1, flexShrink: '0', marginLeft: '32px' }}>
            <button 
              onClick={() => { window.location.href = '/jobs/new'; }} 
              style={{ background: '#ffffff', color: '#022c22', border: 'none', padding: '28px 55px', borderRadius: '16px', fontSize: '20px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)', transition: 'all 0.2s ease', whiteSpace: 'nowrap', letterSpacing: '0.02em' }}
            >
              新規求人を作成 ➔
            </button>
          </div>
        </div>

        {/* 作成済み求人一覧 ＆ 複数条件フィルター */}
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.04)', overflow: 'hidden' }}>
          
          {/* ヘッダー ＆ 絞り込みコントロール */}
          <div style={{ padding: '24px 32px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                作成済み求人一覧 <span style={{ color: '#059669' }}>({filteredJobs.length}件)</span>
              </h3>
            </div>

            {/* 選択式フィルターグループ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <select 
                value={selectedTitle}
                onChange={e => setSelectedTitle(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff', fontWeight: '700', color: '#0f172a', outline: 'none' }}
              >
                <option value="すべて">タイトル: すべて</option>
                {uniqueTitles.map((t, i) => (
                  <option key={i} value={t}>{t}</option>
                ))}
              </select>

              <select 
                value={selectedLocation}
                onChange={e => setSelectedLocation(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff', fontWeight: '700', color: '#0f172a', outline: 'none' }}
              >
                <option value="すべて">勤務地住所: すべて</option>
                {uniqueLocations.map((loc, i) => (
                  <option key={i} value={loc}>{loc}</option>
                ))}
              </select>

              <select 
                value={selectedEmploymentType}
                onChange={e => setSelectedEmploymentType(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff', fontWeight: '700', color: '#0f172a', outline: 'none' }}
              >
                <option value="すべて">雇用形態: すべて</option>
                {uniqueEmploymentTypes.map((emp, i) => (
                  <option key={i} value={emp}>{emp}</option>
                ))}
              </select>

              <select 
                value={selectedPlan}
                onChange={e => setSelectedPlan(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff', fontWeight: '700', color: '#0f172a', outline: 'none' }}
              >
                <option value="すべて">プラン: すべて</option>
                {uniquePlans.map((p, i) => (
                  <option key={i} value={p}>{p}</option>
                ))}
              </select>

              {/* ステータス絞り込み（公開中・停止中のみ） */}
              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff', fontWeight: '700', color: '#0f172a', outline: 'none' }}
              >
                <option value="すべて">ステータス: すべて</option>
                <option value="公開中">🟢 公開中</option>
                <option value="停止中">⚪ 停止中</option>
              </select>
            </div>
          </div>

          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {filteredJobs.length === 0 ? (
              <div style={{ color: '#64748b', fontSize: '14px', fontStyle: 'italic', padding: '40px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                条件に一致する求人は見つかりませんでした。
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredJobs.map((job) => {
                  const originalIndex = jobs.findIndex(j => j.id === job.id);
                  return (
                    <div key={job.id} style={{ background: '#f8fafc', padding: '24px 28px', borderRadius: '16px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'all 0.2s ease' }}>
                      
                      {/* 上段：タイトルとステータス（公開中・停止中のみ）・アクションボタン */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {job.title}
                        </h4>
                        
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
                          <select 
                            value={job.status} 
                            onChange={e => handleStatusChange(originalIndex, e.target.value)} 
                            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff', fontWeight: '700', color: job.status === '公開中' ? '#059669' : '#64748b', outline: 'none' }}
                          >
                            <option value="公開中">🟢 公開中</option>
                            <option value="停止中">⚪ 停止中</option>
                          </select>

                          <button 
                            onClick={() => {
                              if (job.id.startsWith('demo_')) {
                                alert('デモ求人のため編集画面への遷移はできませんが、新規作成画面から自由にテスト作成いただけます。');
                              } else {
                                window.location.href = `/jobs/new?id=${job.id}`;
                              }
                            }} 
                            style={{ background: '#059669', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
                          >
                            編集する
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteJob(job.id)} 
                            style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '9px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
                          >
                            削除
                          </button>
                        </div>
                      </div>

                      {/* 中段：給与・雇用形態 ＆ 勤務地 ＆ 掲載拠点情報 */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px', color: '#475569' }}>
                        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                          <div><strong style={{ color: '#0f172a' }}>給与 / 報酬:</strong> {job.salary}</div>
                          <div><strong style={{ color: '#0f172a' }}>雇用形態:</strong> {job.employmentType}</div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '2px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#047857', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '6px 12px', borderRadius: '8px' }}>
                            <span style={{ fontWeight: '800' }}>🏢 勤務地住所:</span>
                            <span style={{ fontWeight: '700', color: '#0f172a' }}>{job.location}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0369a1', background: '#f0f9ff', border: '1px solid #bae6fd', padding: '6px 12px', borderRadius: '8px' }}>
                            <span style={{ fontWeight: '800' }}>📍 掲載拠点:</span>
                            <span style={{ fontWeight: '700', color: '#0f172a' }}>{job.postingLocationInfo?.name || '本社'}</span>
                            <span style={{ color: '#64748b', fontSize: '12.5px' }}>({job.postingLocationInfo?.address || '住所未登録'})</span>
                          </div>
                        </div>
                      </div>

                      {/* 下段：PV数・応募者数などのアナリティクス ＆ 有料掲載期間 */}
                      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: '11px', color: '#059669', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>閲覧数 (PV)</span>
                          <span style={{ fontSize: '18px', color: '#0f172a', fontWeight: '800' }}>{job.viewCount} <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#64748b' }}>回</span></span>
                        </div>
                        <div style={{ borderLeft: '1px solid #bbf7d0', height: '30px' }}></div>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: '11px', color: '#059669', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>応募者数</span>
                          <span style={{ fontSize: '18px', color: '#0f172a', fontWeight: '800' }}>{job.applicantCount} <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#64748b' }}>名</span></span>
                        </div>
                        <div style={{ borderLeft: '1px solid #bbf7d0', height: '30px' }}></div>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: '11px', color: '#059669', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>掲載プラン & 有料掲載期間</span>
                          <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: 'bold' }}>
                            {job.plan} ({job.duration})
                            <span style={{ display: 'block', fontSize: '11.5px', color: '#047857', fontWeight: '700', marginTop: '2px' }}>
                              📅 掲載期間: {job.startDate} 〜 {job.endDate}
                            </span>
                          </span>
                        </div>
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