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
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // 求人データの取得 ＆ 企業・店舗マスタからの詳細情報（住所・従業員数・電話番号など）の結合
  useEffect(() => {
    if (!jobId) return;

    const fetchJobAndCompanyDetails = async () => {
      try {
        // 詳細PVのカウントアップ
        await fetch(`/api/jobs?id=${jobId}&type=detail`, { method: 'PATCH' }).catch(() => {});

        // 1. 求人詳細データの取得
        const res = await fetch(`/api/jobs`);
        if (res.ok) {
          const data = await res.json();
          const found = data.jobs?.find((j: any) => j.id === jobId);
          if (found) {
            let detailedJob = { ...found };

            // 2. 企業IDがある場合、会社・店舗マスタから最新の詳細情報を取得して結合
            if (found.companyId) {
              const compRes = await fetch(`/api/company?companyId=${found.companyId}`);
              if (compRes.ok) {
                const compData = await compRes.json();
                if (compData && compData.company) {
                  const comp = compData.company;
                  const selectedLocName = found.selectedPostingLocation || found.postingLocationInfo?.name || '本社';

                  // 本社情報の場合
                  const branchLabel = comp.branchType || '本社';
                  if (selectedLocName === branchLabel || selectedLocName === '本社') {
                    detailedJob.postingLocationInfo = {
                      name: branchLabel,
                      address: `${comp.prefecture || ''}${comp.city || ''}${comp.addressSub || ''}${comp.building || ''}`,
                      phone: comp.businessPhone || comp.phone || '未登録',
                      employees: comp.employeeRegular ? `${comp.employeeRegular}名` : '非公開',
                      hours: '9:00 〜 18:00'
                    };
                  } else if (Array.isArray(comp.stores)) {
                    // 店舗情報の中から一致するものを探す
                    const matchedStore = comp.stores.find((store: any, idx: number) => {
                      const storeName = store.name || `${comp.companyName || '店舗'} ${idx + 1}`;
                      return selectedLocName === storeName || selectedLocName.includes(store.name);
                    });

                    if (matchedStore) {
                      detailedJob.postingLocationInfo = {
                        name: matchedStore.name || selectedLocName,
                        address: matchedStore.address || `${matchedStore.prefecture || ''}${matchedStore.city || ''}${matchedStore.addressSub || ''}${matchedStore.building || ''}`,
                        phone: matchedStore.phone || comp.businessPhone || '未登録',
                        employees: matchedStore.employees || '非公開',
                        hours: matchedStore.hours || '9:00 〜 18:00'
                      };
                    }
                  }
                }
              }
            }

            setJob(detailedJob);
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

    fetchJobAndCompanyDetails();
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

  // クリーニング済みの店舗名と詳細情報
  const rawPostingName = job.postingLocationInfo?.name || job.selectedPostingLocation || '本社';
  const cleanPostingName = rawPostingName.split('（')[0].split('(')[0].trim();

  const postingAddress = job.postingLocationInfo?.address || '住所未登録';
  const postingPhone = job.postingLocationInfo?.phone || '未登録';
  const postingEmployees = job.postingLocationInfo?.employees || '非公開';
  const postingHours = job.postingLocationInfo?.hours || '9:00 〜 18:00';

  // 勤務地セクション用のクレンジング
  const rawBuilding = job.buildingName || '';
  const cleanBuilding = (rawBuilding.length > 15 || rawBuilding.includes('頑張ろう')) ? '' : rawBuilding;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* トップコントロールバー */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ background: '#059669', color: '#fff', fontSize: '11px', fontWeight: '800', padding: '5px 14px', borderRadius: '20px', letterSpacing: '0.05em' }}>
            求人詳細プレビュー
          </span>
          <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontSize: '11.5px', fontWeight: '800', padding: '5px 14px', borderRadius: '20px' }}>
            👀 詳細閲覧数: {job.detailPvCount || 0} 回
          </span>
          <div style={{ background: '#f1f5f9', padding: '4px', borderRadius: '10px', display: 'flex', gap: '4px', border: '1px solid #cbd5e1' }}>
            <button
              type="button"
              onClick={() => setIsMobileFrame(false)}
              style={{ background: !isMobileFrame ? '#059669' : 'transparent', color: !isMobileFrame ? '#fff' : '#475569', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              💻 PC表示
            </button>
            <button
              type="button"
              onClick={() => setIsMobileFrame(true)}
              style={{ background: isMobileFrame ? '#059669' : 'transparent', color: isMobileFrame ? '#fff' : '#475569', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              📱 スマホ表示
            </button>
          </div>
        </div>
        <div>
          <button 
            type="button" 
            onClick={() => window.location.href = '/dashboard/jobs'}
            style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '10px', fontSize: '13.5px', fontWeight: '700', cursor: 'pointer' }}
          >
            ← 求人一覧に戻る
          </button>
        </div>
      </div>

      {/* メインプレビューコンテンツ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 20px' }}>
        <div style={{ 
          maxWidth: isMobileFrame ? '410px' : '900px', 
          margin: '0 auto', 
          padding: isMobileFrame ? '20px 10px' : '0 20px', 
          background: isMobileFrame ? '#0f172a' : 'transparent',
          borderRadius: isMobileFrame ? '40px' : '0',
          boxShadow: isMobileFrame ? '0 25px 50px -12px rgba(0,0,0,0.5)' : 'none',
          border: isMobileFrame ? '10px solid #334155' : 'none',
          height: isMobileFrame ? '740px' : 'auto',
          maxHeight: isMobileFrame ? '740px' : 'none',
          overflowY: isMobileFrame ? 'auto' : 'visible',
          transition: 'all 0.3s ease'
        }}>
          
          <div style={{ 
            background: isMobileFrame ? '#f8fafc' : 'transparent', 
            borderRadius: isMobileFrame ? '24px' : '0', 
            overflow: 'visible',
            padding: isMobileFrame ? '16px' : '0',
            display: 'flex', 
            flexDirection: 'column', 
            gap: isMobileFrame ? '20px' : '32px' 
          }}>
            
            {/* 職種・雇用形態バッジ */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {Array.isArray(job.selectedJobCategories) && job.selectedJobCategories.map((cat: string, i: number) => (
                <span key={i} style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '5px 12px', borderRadius: '8px', fontSize: isMobileFrame ? '11.5px' : '13px', fontWeight: '800', whiteSpace: 'nowrap' }}>
                  {cat}
                </span>
              ))}
              <span style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '5px 12px', borderRadius: '8px', fontSize: isMobileFrame ? '11.5px' : '13px', fontWeight: '800', whiteSpace: 'nowrap' }}>
                {job.employmentType || '正社員'}
              </span>
              <span style={{ background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a', padding: '5px 12px', borderRadius: '8px', fontSize: isMobileFrame ? '11.5px' : '13px', fontWeight: '800', whiteSpace: 'nowrap' }}>
                ステータス: {job.status || '公開中'}
              </span>
            </div>

            {/* タイトル */}
            <h1 style={{ fontSize: isMobileFrame ? '22px' : '34px', fontWeight: '900', lineHeight: '1.35', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              {job.title}
            </h1>

            {/* 給与ブロック */}
            <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)', border: '2px solid #059669', borderRadius: '20px', padding: isMobileFrame ? '20px' : '32px 40px', display: 'flex', flexDirection: isMobileFrame ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobileFrame ? 'flex-start' : 'center', gap: '16px', boxShadow: '0 15px 35px rgba(5, 150, 105, 0.12)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ background: '#059669', color: '#fff', fontSize: '10px', fontWeight: '900', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>POINT 01</span>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#059669', letterSpacing: '0.05em' }}>想定給与 / 報酬</span>
                </div>
                <span style={{ fontSize: isMobileFrame ? '22px' : '30px', fontWeight: '900', color: '#0f172a' }}>
                  {job.salary}
                </span>
                {job.salaryDetail && <p style={{ margin: '6px 0 0 0', fontSize: isMobileFrame ? '12px' : '13px', color: '#475569', whiteSpace: 'pre-wrap' }}>{job.salaryDetail}</p>}
              </div>
              <div style={{ borderLeft: isMobileFrame ? 'none' : '2px solid #a7f3d0', paddingLeft: isMobileFrame ? '0' : '32px', paddingTop: isMobileFrame ? '10px' : '0', borderTop: isMobileFrame ? '1px solid #e2e8f0' : 'none', width: '100%' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>募集人数</span>
                <span style={{ fontSize: isMobileFrame ? '15px' : '18px', fontWeight: '900', color: '#0f172a' }}>{job.headcount || '未設定'}</span>
              </div>
            </div>

            {/* 写真ギャラリー */}
            {Array.isArray(job.jobImages) && job.jobImages.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontSize: isMobileFrame ? '15px' : '18px', fontWeight: '900', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '6px', height: '16px', background: '#059669', borderRadius: '3px', display: 'inline-block' }}></span>
                  職場の雰囲気・チームメンバー
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: isMobileFrame ? '1fr' : 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
                  {job.jobImages.map((img: string, idx: number) => (
                    <div key={idx} style={{ borderRadius: '16px', overflow: 'hidden', height: isMobileFrame ? '180px' : '240px', border: '1px solid #e2e8f0', background: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                      <img src={img} alt={`職場の様子 ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ミッション */}
            {job.mission && (
              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderLeft: '5px solid #059669', borderRadius: '20px', padding: isMobileFrame ? '20px' : '38px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ background: '#ecfdf5', color: '#047857', fontSize: '10.5px', fontWeight: '900', padding: '2px 8px', borderRadius: '6px' }}>POINT 02</span>
                  <h2 style={{ fontSize: isMobileFrame ? '17px' : '21px', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                    私たちが目指すミッション・仕事内容
                  </h2>
                </div>
                <p style={{ fontSize: isMobileFrame ? '13.5px' : '15.5px', lineHeight: '1.85', color: '#334155', whiteSpace: 'pre-wrap', margin: 0 }}>
                  {job.mission}
                </p>
                {job.dailyWork && (
                  <div style={{ marginTop: '10px', background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                    <strong style={{ display: 'block', color: '#0f172a', marginBottom: '6px', fontSize: '13.5px', fontWeight: '800' }}>📌 日々の具体的な業務例</strong>
                    <p style={{ margin: 0, color: '#475569', fontSize: '13.5px', whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>{job.dailyWork}</p>
                  </div>
                )}
              </div>
            )}

            {/* チームの雰囲気 */}
            {job.teamAtmosphere && (
              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderLeft: '5px solid #3b82f6', borderRadius: '20px', padding: isMobileFrame ? '20px' : '38px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '10.5px', fontWeight: '900', padding: '2px 8px', borderRadius: '6px' }}>CULTURE</span>
                  <h2 style={{ fontSize: isMobileFrame ? '17px' : '21px', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                    チームの雰囲気・社風
                  </h2>
                </div>
                <p style={{ fontSize: isMobileFrame ? '13.5px' : '15.5px', lineHeight: '1.85', color: '#334155', whiteSpace: 'pre-wrap', margin: 0 }}>{job.teamAtmosphere}</p>
              </div>
            )}

            {/* 応募要件 */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: isMobileFrame ? '20px' : '38px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
              <h2 style={{ fontSize: isMobileFrame ? '17px' : '21px', fontWeight: '900', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '18px', background: '#059669', borderRadius: '3px', display: 'inline-block' }}></span>
                応募要件
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '12px', fontWeight: '900', color: '#047857', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '3px 10px', borderRadius: '6px', width: 'fit-content' }}>必須要件（MUST）</span>
                <p style={{ margin: 0, fontSize: isMobileFrame ? '13.5px' : '15px', lineHeight: '1.8', color: '#334155', whiteSpace: 'pre-wrap' }}>{job.mustRequirements || '（必須要件未入力）'}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '12px', fontWeight: '900', color: '#1d4ed8', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '3px 10px', borderRadius: '6px', width: 'fit-content' }}>歓迎要件（WANT）</span>
                <p style={{ margin: 0, fontSize: isMobileFrame ? '13.5px' : '15px', lineHeight: '1.8', color: '#334155', whiteSpace: 'pre-wrap' }}>{job.wantRequirements || '（歓迎要件未入力）'}</p>
              </div>
            </div>

            {/* 勤務地・働く環境 */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: isMobileFrame ? '20px' : '38px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
              <h2 style={{ fontSize: isMobileFrame ? '17px' : '21px', fontWeight: '900', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '18px', background: '#059669', borderRadius: '3px', display: 'inline-block' }}></span>
                勤務地・働く環境
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px', fontWeight: '800' }}>勤務地</span>
                  <span style={{ fontSize: '14px', fontWeight: '900', color: '#0f172a' }}>{job.prefAndCity || ''} {job.streetNumber || ''} {cleanBuilding}</span>
                </div>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px', fontWeight: '800' }}>アクセス</span>
                  <span style={{ fontSize: '14px', fontWeight: '900', color: '#0f172a' }}>{job.accessStation || ''}より{job.accessMethod || '徒歩'}約{job.accessMinutes || ''}分</span>
                </div>
              </div>

              {Array.isArray(job.selectedBenefits) && job.selectedBenefits.length > 0 && (
                <div style={{ marginTop: '6px' }}>
                  <strong style={{ color: '#0f172a', display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: '900' }}>✨ 福利厚生・手当</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {job.selectedBenefits.map((b: string, i: number) => (
                      <span key={i} style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '8px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: '800' }}>
                        ✓ {b}
                      </span>
                    ))}
                    {job.benefitsExtra && (
                      <span style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '8px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: '800' }}>
                        ✓ {job.benefitsExtra}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 選考プロセス */}
            {Array.isArray(job.selectionSteps) && job.selectionSteps.length > 0 && (
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: isMobileFrame ? '20px' : '38px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                <h2 style={{ fontSize: isMobileFrame ? '17px' : '21px', fontWeight: '900', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '6px', height: '18px', background: '#059669', borderRadius: '3px', display: 'inline-block' }}></span>
                  選考プロセス
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {job.selectionSteps.map((step: string, idx: number) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ background: '#059669', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '900', flexShrink: 0 }}>
                        {idx + 1}
                      </div>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px', flex: '1', fontSize: '14px', fontWeight: '900', color: '#0f172a' }}>
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 求人掲載拠点情報 */}
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderLeft: '5px solid #0284c7', borderRadius: '20px', padding: isMobileFrame ? '20px' : '32px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '10.5px', fontWeight: '900', padding: '2px 8px', borderRadius: '6px' }}>COMPANY / STORE</span>
                <h3 style={{ fontSize: isMobileFrame ? '16px' : '19px', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                  求人掲載拠点情報
                </h3>
              </div>
              
              <p style={{ fontSize: '12px', color: '#d97706', background: '#fffbeb', border: '1px solid #fde68a', padding: '8px 12px', borderRadius: '8px', margin: 0, lineHeight: '1.5', fontWeight: '700' }}>
                ※勤務先の情報ではありません。勤務地情報に関しては「勤務地・働く環境」になります。
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', fontSize: '13.5px' }}>
                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '2px' }}>店舗名 / 本社</span>
                  <span style={{ fontWeight: '800', color: '#0f172a' }}>{cleanPostingName}</span>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '2px' }}>住所</span>
                  <span style={{ fontWeight: '800', color: '#0f172a' }}>{postingAddress}</span>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '2px' }}>電話番号</span>
                  <span style={{ fontWeight: '800', color: '#0f172a' }}>{postingPhone}</span>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '2px' }}>従業員数 / 営業時間</span>
                  <span style={{ fontWeight: '800', color: '#0f172a' }}>従業員数: {postingEmployees} / 営業時間: {postingHours}</span>
                </div>
              </div>
            </div>

            {/* 一覧に戻るボタン */}
            <div style={{ paddingBottom: '40px' }}>
              <button 
                type="button" 
                onClick={() => window.location.href = '/dashboard/jobs'}
                style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '14px 24px', borderRadius: '14px', fontSize: '14px', fontWeight: '800', cursor: 'pointer', width: '100%' }}
              >
                求人一覧に戻る
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}