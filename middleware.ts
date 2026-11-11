// middleware.ts （プロジェクトのルートに配置）
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'nexus-secret-key-secure';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 保護対象のパスリスト（元の仕様を完全維持）
  const protectedPaths = ['/home', '/overview', '/applicants', '/dm', '/jobs', '/support'];
  const isProtected = protectedPaths.some((p) => path.startsWith(p));

  if (isProtected) {
    // 1. 従来の companyId チェック（元の仕様を維持）
    const companyId = request.cookies.get('nexus_company_id')?.value;
    // 2. 新規追加: 24時間有効期限つきJWTトークンのチェック
    const token = request.cookies.get('nexus_token')?.value;

    // 認証情報（Cookie）がない、またはJWTの有効期限が切れている場合はログイン画面へ強制リダイレクト
    if (!companyId || !token) {
      const loginUrl = new URL('/login', request.url);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete('nexus_token');
      res.cookies.delete('nexus_company_id');
      return res;
    }

    try {
      // 24時間経過している、または改ざんされていないかの署名検証
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      // 期限切れや不正なトークンの場合は強制ログアウトしてログイン画面へ
      const loginUrl = new URL('/login', request.url);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete('nexus_token');
      res.cookies.delete('nexus_company_id');
      return res;
    }
  }

  return NextResponse.next();
}

// ミドルウェアを適用するパスの指定（元の仕様を完全維持）
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