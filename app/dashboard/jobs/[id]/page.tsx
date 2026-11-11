// app/dashboard/jobs/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params?.id as string;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const fetchJobDetail = async () => {
      try {
        // すべての求人を取得して該当のIDを検索するAPI経由の処理
        const res = await fetch(`/api/jobs`);
        if (res.ok) {
          const data = await res.json();
          const found = data.jobs?.find((j: any) => j.id === jobId);
          if (found) {
            setJob(found);
          } else {
            setError('該当する求人が見つかりませんでした。');
          }
        } else {
          setError('求人情報の取得に失敗しました。');
        }
      } catch (err) {
        console.error('詳細取得エラー:', err);
        setError('通信エラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobId]);

  if (loading) {
    return <div style={{ padding: '80px', textAlign: 'center', color: '#64748b', fontSize: '15px' }}>読み込み中...</div>;
  }

  if (error || !job) {
    return (
      <div style={{ padding: '80px', textAlign: 'center', color: '#ef4444', fontSize: '16px', fontWeight: 'bold' }}>
        {error || '求人が見つかりませんでした。'}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', background: '#ffffff', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* ヘッダー・戻るボタン */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
          <span style={{ background: '#059669', color: '#fff', fontSize: '12px', fontWeight: '800', padding: '6px 16px', borderRadius: '20px' }}>
            求人詳細プレビュー
          </span>
          <button 
            type="button"
            onClick={() => window.location.href = '/dashboard/jobs'}
            style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
          >
            ← 求人一覧に戻る
          </button>
        </div>

        {/* 基本情報 */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {job.employmentType && (
            <span style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '5px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '800' }}>
              {job.employmentType}
            </span>
          )}
          <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '5px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '800' }}>
            ステータス: {job.status}
          </span>
        </div>

        <h1 style={{ fontSize: '30px', fontWeight: '900', lineHeight: '1.35', color: '#0f172a', margin: 0 }}>
          {job.title}
        </h1>

        {/* 給与ブロック */}
        <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)', border: '2px solid #059669', borderRadius: '20px', padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 15px 35px rgba(5, 150, 105, 0.12)' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#059669', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>想定給与 / 報酬</span>
            <span style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a' }}>
              {job.salary}
            </span>
          </div>
          <div style={{ borderLeft: '2px solid #a7f3d0', paddingLeft: '32px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', display: 'block', marginBottom: '4px' }}>掲載プラン</span>
            <span style={{ fontSize: '16px', fontWeight: '900', color: '#0f172a' }}>{job.plan} ({job.duration})</span>
          </div>
        </div>

        {/* 勤務地・アクセス */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', margin: 0 }}>勤務地・掲載拠点</h2>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '800' }}>勤務地住所</span>
            <span style={{ fontSize: '15px', fontWeight: '900', color: '#0f172a' }}>{job.location}</span>
          </div>
          {job.postingLocationInfo && (
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: '#0369a1', fontWeight: '800' }}>求人掲載拠点（店舗・本社）</span>
              <span style={{ fontSize: '15px', fontWeight: '900', color: '#0f172a' }}>{job.postingLocationInfo.name} ({job.postingLocationInfo.address})</span>
            </div>
          )}
        </div>

        {/* 一覧に戻るボタン */}
        <button 
          type="button"
          onClick={() => window.location.href = '/dashboard/jobs'}
          style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#ffffff', border: 'none', padding: '16px', borderRadius: '14px', fontSize: '15px', fontWeight: '900', cursor: 'pointer', textAlign: 'center' }}
        >
          求人一覧に戻る
        </button>

      </div>
    </div>
  );
}