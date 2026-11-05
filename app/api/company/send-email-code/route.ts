// app/api/company/send-email-code/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const ENCRYPTION_SECRET = crypto.createHash('sha256').update(process.env.NEXTAUTH_SECRET || process.env.RESEND_API_KEY || 'nexus-vision-secure-secret-key').digest();
const ALGORITHM = 'aes-256-gcm';

function encryptData(text: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_SECRET, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${tag}:${encrypted}`;
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'メールアドレスを入力してください。' }, { status: 400 });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    const tokenData = JSON.stringify({ email, verificationCode, expiresAt });
    const encryptedToken = encryptData(tokenData);

    const cookieStore = await cookies();
    cookieStore.set({
      name: 'nexus_temp_auth',
      value: encryptedToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 10,
    });

    // 開発・本番共通の安全なロギング
    console.log(`✨ 認証コード発行: 宛先 ${email} / コード ${verificationCode}`);

    // 本番環境のResend APIによるメール送信処理
    const apiKey = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.trim() : '';
    if (apiKey) {
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: 'ネクビジョ求人 運営事務局 <support@nexus-vision.net>',
          to: [email],
          subject: '【ネクビジョ求人】メールアドレス変更に関する二段階認証コードのご案内',
          text: `
平素は「ネクビジョ求人」をご利用いただき、誠にありがとうございます。
ネクビジョ求人 運営事務局でございます。

この度、企業マイページのログインメールアドレス変更に関するリクエストを承りました。
手続きを安全に完了させるため、以下の二段階認証コードを画面に入力してください。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 二段階認証コード
${verificationCode}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【重要なお願い・ご注意】
・本コードの有効期限は、発行から【10分間】となります。
・期限が切れた場合は、お手数ですが再度マイページより認証コードの再発行をお願い申し上げます。
・本メールに身覚えがない場合や、心当たりがない場合は、第三者による不正アクセスの可能性がございますので、お手数ですが速やかに本メールを破棄し、運営事務局までご連絡ください。

--------------------------------------------------
ネクビジョ求人 運営事務局
公式サイト: https://nexus-vision.net
お問い合わせ: info@nexus-vision.net
--------------------------------------------------
          `.trim(),
        }),
      }).catch(err => console.error('Background Email Send Error:', err));
    }

    return NextResponse.json({ success: true, message: '認証コードを送信しました。' });

  } catch (error: any) {
    console.error('Send Email Code Error:', error);
    return NextResponse.json({ error: 'コードの送信処理に失敗しました。' }, { status: 500 });
  }
}