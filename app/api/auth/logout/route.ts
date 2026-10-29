// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Cookieの有効期限を過去に設定して上書き削除
    cookieStore.set({
      name: 'nexus_company_id',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0, // 即座に有効期限切れにする
    });

    return NextResponse.json({ success: true, message: 'ログアウトしました。' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'ログアウト処理に失敗しました。' }, { status: 500 });
  }
}