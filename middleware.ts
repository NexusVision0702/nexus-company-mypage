// middleware.ts （プロジェクトのルートに配置）
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 保護対象のパスリスト
  const protectedPaths = ['/home', '/overview', '/applicants', '/dm', '/jobs', '/support'];
  const isProtected = protectedPaths.some((p) => path.startsWith(p));

  if (isProtected) {
    // Cookieからセッション情報（companyIdなど）を取得
    const companyId = request.cookies.get('nexus_company_id')?.value;

    // 認証情報（Cookie）がない場合はログイン画面へ強制リダイレクト
    if (!companyId) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// ミドルウェアを適用するパスの指定
export const config = {
  matcher: [
    '/home/:path*',
    '/overview/:path*',
    '/applicants/:path*',
    '/dm/:path*',
    '/jobs/:path*',
    '/support/:path*',
  ],
};