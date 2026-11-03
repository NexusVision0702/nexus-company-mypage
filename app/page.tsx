// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // 💡 確実にログイン画面からスタートさせたい場合は、
    // アクセス時に強制的にログインページへリダイレクトさせます
    router.replace('/login');
  }, [router]);

  return (
    <div style={{ padding: '100px', textAlign: 'center', color: '#64748b', fontSize: '15px', fontFamily: 'sans-serif' }}>
      ログイン画面へ移動中...
    </div>
  );
}