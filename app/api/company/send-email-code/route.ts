import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const accessKeyId = process.env.MY_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.MY_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '';
const region = process.env.MY_AWS_REGION || process.env.AWS_REGION || 'ap-northeast-1';
const TABLE_NAME = process.env.MY_DYNAMODB_COMPANY_TABLE || process.env.DYNAMODB_COMPANY_TABLE || 'nexus-job-board';

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

const client = new DynamoDBClient({
  region,
  credentials: { accessKeyId, secretAccessKey },
});
const docClient = DynamoDBDocumentClient.from(client);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'メールアドレスを入力してください。' }, { status: 400 });
    }

    const inputEmail = String(email).toLowerCase().trim();

    // DynamoDBからデータを取得
    const scanResult = await docClient.send(new ScanCommand({
      TableName: TABLE_NAME,
    }));

    const items = scanResult.Items || [];

    const foundCompany = items.find((doc) => {
      if (!doc.id || doc.id.startsWith('code_')) return false;
      const dbEmail = doc.email ? String(doc.email).toLowerCase().trim() : '';
      const dbBusinessEmail = doc.businessEmail ? String(doc.businessEmail).toLowerCase().trim() : '';
      const dbAccountingEmail = doc.accountingEmail ? String(doc.accountingEmail).toLowerCase().trim() : '';
      
      return dbEmail === inputEmail || dbBusinessEmail === inputEmail || dbAccountingEmail === inputEmail;
    });

    // パスワードが送信されている場合のみ（ログイン時など）、認証チェックを行う
    if (password) {
      if (!foundCompany) {
        return NextResponse.json({ error: 'ご入力いただいたIDまたはパスワードが正しくありません。' }, { status: 401 });
      }

      const lockUntil = foundCompany.lockUntil || 0;
      if (Date.now() < lockUntil) {
        const remainingMinutes = Math.ceil((lockUntil - Date.now()) / (60 * 1000));
        return NextResponse.json({ 
          error: `セキュリティ保護のため、アカウントが一時ロックされています。約 ${remainingMinutes} 分後にお試しください。` 
        }, { status: 429 });
      }

      const storedPassword = foundCompany.password || foundCompany.companyPassword || '';
      
      let isPasswordValid = false;
      if (storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2y$')) {
        isPasswordValid = await bcrypt.compare(password, storedPassword);
      } else {
        isPasswordValid = (storedPassword === password);
      }

      if (!isPasswordValid) {
        return NextResponse.json({ error: 'ご入力いただいたIDまたはパスワードが正しくありません。' }, { status: 401 });
      }
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    // ★ 修正：入力された新しいメールアドレスを確実にトークンに持たせる
    const tokenData = JSON.stringify({ email: email, verificationCode, expiresAt });
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

    // メール送信（非同期）
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
          subject: '【ネクビジョ求人】企業マイページ ログイン認証コードのお知らせ',
          text: `
いつも「ネクビジョ求人」をご利用いただき、誠にありがとうございます。
ネクビジョ求人 運営事務局でございます。

企業マイページへのログインリクエストを受け付けいたしました。
以下の二段階認証コードをログイン画面に入力し、手続きを完了させてください。

--------------------------------------------------
【二段階認証コード】
${verificationCode}
--------------------------------------------------

※この認証コードの有効期限は発行から【10分間】となります。
※心当たりがない場合は、お手数ですが本メールを破棄してください。

--------------------------------------------------
ネクビジョ求人 運営事務局
公式サイト: https://nexus-vision.net
お問い合わせ: info@nexus-vision.net
--------------------------------------------------
          `.trim(),
        }),
      }).catch(err => console.error('Background Email Error:', err));
    }

    return NextResponse.json({ success: true, message: '認証コードを送信しました。' });

  } catch (error: any) {
    console.error('Login API Error:', error);
    return NextResponse.json({ error: 'ログイン処理に失敗しました。' }, { status: 500 });
  }
}