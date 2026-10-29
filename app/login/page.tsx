// app/login/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'credentials' | 'code'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ステップ1: ID(メールアドレス) & パスワード検証 ＆ 認証コード送信
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('メールアドレスとパスワードを入力してください。');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-login-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '認証に失敗しました。');
      }

      setSuccessMsg('ご登録のメールアドレスに二段階認証コード（6桁）を送信しました。');
      setStep('code');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ステップ2: 認証コード検証 ＆ ログイン完了
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!verificationCode.trim()) {
      setErrorMsg('6桁の認証コードを入力してください。');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-login-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, verificationCode }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '認証コードが正しくありません。');
      }

      // ログイン成功時に会社IDをローカルストレージに保存
      localStorage.setItem('nexus_company_id', data.companyId || 'demo_company_001');

      router.push('/overview');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ background: '#ffffff', borderRadius: '24px', boxShadow: '0 12px 40px rgba(0,0,0,0.08)', width: '100%', maxWidth: '540px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        
        {/* ヘッダーセッション：キャラクター＆ロゴ */}
        <div style={{ background: 'linear-gradient(180deg, #ecfdf5 0%, #ffffff 100%)', padding: '36px 40px 24px 40px', textAlign: 'center', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
            
            {/* 1. ライオン2 (/lion2.png) */}
            <img 
              src="/lion2.png" 
              alt="キャラクター2" 
              style={{ width: '80px', height: '80px', objectFit: 'contain' }} 
            />

            {/* 2. ロゴ (/logo.png) */}
            <img 
              src="/logo.png" 
              alt="ネクビジョ求人 ロゴ" 
              style={{ width: '80px', height: '80px', objectFit: 'contain' }} 
            />

            {/* 3. ライオン1 (/lion1.png) */}
            <img 
              src="/lion1.png" 
              alt="キャラクター1" 
              style={{ width: '80px', height: '80px', objectFit: 'contain' }} 
            />

          </div>

          <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            企業マイページ ログイン
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
            {step === 'credentials' 
              ? 'ご登録のID（メールアドレス）とパスワードを入力してください。' 
              : `${email} 宛てに送信された6桁の認証コードを入力してください。`}
          </p>
        </div>

        {/* フォーム本体 */}
        <div style={{ padding: '36px 40px' }}>
          {errorMsg && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', marginBottom: '20px', fontWeight: '600', lineHeight: '1.4' }}>
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', marginBottom: '20px', fontWeight: '600', lineHeight: '1.4' }}>
              {successMsg}
            </div>
          )}

          {step === 'credentials' && (
            <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#334155', marginBottom: '6px' }}>
                  ID (担当者メールアドレス) *
                </label>
                <input 
                  type="email"
                  required
                  placeholder="example@company.co.jp"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none', background: '#f8fafc', boxSizing: 'border-box', fontWeight: '500' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#334155', marginBottom: '6px' }}>
                  パスワード *
                </label>
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none', background: '#f8fafc', boxSizing: 'border-box', fontWeight: '500' }}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                style={{ background: '#059669', color: '#ffffff', border: 'none', padding: '15px', borderRadius: '12px', fontSize: '15px', fontWeight: '900', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)', opacity: loading ? 0.7 : 1, transition: 'all 0.2s', marginTop: '8px' }}
              >
                {loading ? '確認中...' : '認証コードを送信する ➔'}
              </button>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={handleVerifyCode} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#334155', marginBottom: '6px' }}>
                  6桁の二段階認証コード *
                </label>
                <input 
                  type="text"
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '22px', textAlign: 'center', letterSpacing: '0.3em', outline: 'none', background: '#f8fafc', boxSizing: 'border-box', fontWeight: '800' }}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                style={{ background: '#059669', color: '#ffffff', border: 'none', padding: '15px', borderRadius: '12px', fontSize: '15px', fontWeight: '900', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)', opacity: loading ? 0.7 : 1, transition: 'all 0.2s', marginTop: '8px' }}
              >
                {loading ? '認証中...' : 'ログインする ➔'}
              </button>

              <button 
                type="button"
                onClick={() => setStep('credentials')}
                style={{ background: 'transparent', color: '#64748b', border: 'none', padding: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
              >
                ID・パスワードを再入力する
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}