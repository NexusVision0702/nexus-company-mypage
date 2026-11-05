// app/api/company/verify-email-code/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const ENCRYPTION_SECRET = crypto.createHash('sha256').update(process.env.NEXTAUTH_SECRET || process.env.RESEND_API_KEY || 'nexus-vision-secure-secret-key').digest();
const ALGORITHM = 'aes-256-gcm';

function decryptData(encryptedText: string): string | null {
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) return null;
    const iv = Buffer.from(parts[0], 'hex');
    const tag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_SECRET, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'メールアドレスと認証コードを入力してください。' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const tempAuthCookie = cookieStore.get('nexus_temp_auth');

    if (!tempAuthCookie || !tempAuthCookie.value) {
      return NextResponse.json({ error: '認証コードの有効期限が切れています。再度コードを送信してください。' }, { status: 400 });
    }

    const decryptedString = decryptData(tempAuthCookie.value);
    if (!decryptedString) {
      return NextResponse.json({ error: '認証情報の復号に失敗しました。' }, { status: 400 });
    }

    const tokenData = JSON.parse(decryptedString);

    if (Date.now() > tokenData.expiresAt) {
      return NextResponse.json({ error: '認証コードの有効期限（10分）が切れています。' }, { status: 400 });
    }

    const storedEmail = String(tokenData.email).toLowerCase().trim();
    const inputEmail = String(email).toLowerCase().trim();
    const storedCode = String(tokenData.verificationCode).trim();
    const inputCode = String(code).trim();

    if (storedEmail !== inputEmail || storedCode !== inputCode) {
      return NextResponse.json({ error: '認証コードが正しくありません。' }, { status: 400 });
    }

    // 認証成功時、一時クッキーをクリア
    cookieStore.set({
      name: 'nexus_temp_auth',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return NextResponse.json({ success: true, message: 'メールアドレスの認証に成功しました。' });

  } catch (error: any) {
    console.error('Verify Email Code Error:', error);
    return NextResponse.json({ error: '認証処理に失敗しました。' }, { status: 500 });
  }
}