import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'メールアドレスとパスワードを入力してください。' }, { status: 400 });
    }

    // 環境変数の前後の空白（トリム処理）を行い、読み込みミスを完全に防止
    const accessKeyId = (process.env.MY_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '').trim();
    const secretAccessKey = (process.env.MY_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '').trim();
    const region = (process.env.MY_AWS_REGION || process.env.AWS_REGION || 'ap-northeast-1').trim();
    const TABLE_NAME = (process.env.MY_DYNAMODB_COMPANY_TABLE || process.env.DYNAMODB_COMPANY_TABLE || 'nexus-job-board').trim();

    if (!accessKeyId || !secretAccessKey) {
      return NextResponse.json({ error: '【設定エラー】AWSのアクセスキーが読み込めません。' }, { status: 500 });
    }

    const client = new DynamoDBClient({ region, credentials: { accessKeyId, secretAccessKey } });
    const docClient = DynamoDBDocumentClient.from(client);

    const inputEmail = String(email).toLowerCase().trim();

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

    if (!foundCompany) {
      return NextResponse.json({ error: 'ご入力いただいたIDまたはパスワードが正しくありません。' }, { status: 401 });
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

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    const secretKeyStr = process.env.NEXTAUTH_SECRET || process.env.RESEND_API_KEY || 'fallback-secure-key';
    const ENCRYPTION_SECRET = crypto.createHash('sha256').update(secretKeyStr).digest();
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_SECRET, iv);
    
    const tokenData = JSON.stringify({ email: foundCompany.email || email, verificationCode, expiresAt });
    let encrypted = cipher.update(tokenData, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');
    const encryptedToken = `${iv.toString('hex')}:${tag}:${encrypted}`;

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

    // Resend APIを使った二段階認証メールの送信処理を復元
    const apiKey = (process.env.RESEND_API_KEY || '').trim();
    if (apiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
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
        });
      } catch (mailErr) {
        console.error('Mail Send Error:', mailErr);
      }
    }

    return NextResponse.json({ success: true, message: '認証コードを送信しました。' });

  } catch (error: any) {
    console.error('🔥 Login API Detailed Error:', error);
    return NextResponse.json({ error: `サーバーエラー詳細: ${error.message || String(error)}` }, { status: 500 });
  }
}