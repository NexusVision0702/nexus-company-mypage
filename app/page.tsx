// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const companyId = localStorage.getItem('nexus_company_id');
    if (!companyId) {
      router.replace('/login');
    } else {
      router.replace('/home');
    }
  }, [router]);

  return (
    <div style={{ padding: '80px', textAlign: 'center', color: '#64748b', fontSize: '14px', fontFamily: 'sans-serif' }}>
      読み込み中...
    </div>
  );
}