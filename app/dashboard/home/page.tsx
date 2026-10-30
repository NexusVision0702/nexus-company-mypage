// app/dashboard/home/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { CompanyData } from '../../../types/company';
import Link from 'next/link';

export default function StoresDashboard() {
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

  return (
    <div style={{ minHeight: '80vh', background: '#f8fafc', fontFamily: 'sans-serif', padding: '40px 0', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>🏢 本社・店舗情報管理</h1>
          <Link href="/dashboard/home" style={{ fontSize: '14px', color: '#2563eb', textDecoration: 'none', fontWeight: 'bold' }}>
            ← ホームに戻る
          </Link>
        </div>

        <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px' }}>登録情報</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '14px', color: '#334155' }}>
            <div>
              <strong>代表者名:</strong> {currentCompany?.representativeName || '未設定'}
            </div>
            <div>
              <strong>ご担当者名:</strong> {currentCompany?.contactName || '未設定'}
            </div>
            <div>
              <strong>電話番号:</strong> {currentCompany?.phone || '未設定'}
            </div>
            <div>
              <strong>メールアドレス:</strong> {currentCompany?.email || '未設定'}
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <strong>所在地:</strong> {currentCompany?.address || '未設定'}
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <strong>インボイス登録番号:</strong> {currentCompany?.invoiceNumber || '未設定'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}