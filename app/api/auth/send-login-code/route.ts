import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const accessKeyId = process.env.MY_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.MY_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '';
const region = process.env.MY_AWS_REGION || process.env.AWS_REGION || 'ap-northeast-1';
const TABLE_NAME = process.env.MY_DYNAMODB_COMPANY_TABLE || process.env.DYNAMODB_COMPANY_TABLE || 'nexus-job-board';

const ENCRYPTION_SECRET = crypto.createHash('sha256').update(process.env.NEXTAUTH_SECRET || 'nexus-vision-secure-secret-key').digest();
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
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'メールアドレスとパスワードを入力してください。' }, { status: 400 });
    }

    let foundCompany: any = null;

    if (accessKeyId && secretAccessKey) {
      const client = new DynamoDBClient({
        region,
        credentials: { accessKeyId, secretAccessKey },
      });
      const docClient = DynamoDBDocumentClient.from(client);

      const scanResult = await docClient.send(new ScanCommand({
        TableName: TABLE_NAME,
      }));

      const items = scanResult.Items || [];
      const inputEmail = String(email).toLowerCase().trim();

      // --- デバッグ用ログ出力 ---
      console.log('--- ログイン検索デバッグ ---');
      console.log('入力されたメールアドレス (inputEmail):', inputEmail);
      console.log('DynamoDBから取得した総レコード数:', items.length);
      items.forEach((doc, index) => {
        console.log(`[${index}] id: ${doc.id}, email: "${doc.email}"`);
      });
      // -------------------------

      // ログイン用email（doc.email）のみで厳格に照合
      foundCompany = items.find((doc) => {
        if (doc.id && doc.id.startsWith('code_')) return false;
        const dbEmail = doc.email ? String(doc.email).toLowerCase().trim() : '';
        return dbEmail === inputEmail;
      });

      if (foundCompany) {
        const storedPassword = foundCompany.password || foundCompany.companyPassword;
        
        // パスワードが登録されていない、または入力値と一致しない場合は401エラーで弾く
        if (!storedPassword || storedPassword !== password) {
          return NextResponse.json({ error: 'ご入力いただいたIDまたはパスワードが正しくありません。' }, { status: 401 });
        }
      }
    }

    if (!foundCompany) {
      return NextResponse.json({ error: 'ご入力いただいたメールアドレスは登録されていません。' }, { status: 404 });
    }

    // 6桁の認証コード生成
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

    const apiKey = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.trim() : '';
    if (!apiKey) {
      return NextResponse.json({ error: 'メール配信システムの設定エラーです。' }, { status: 500 });
    }

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'ネクビジョ求人 運営事務局 <support@nexus-vision.net>',
        to: [email],
        subject: '【ネクビジョ求人】企業マイページ 二段階認証コード',
        text: `認証コードは ${verificationCode} です。`,
      }),
    });

    if (!resendRes.ok) {
      return NextResponse.json({ error: 'メールの送信に失敗しました。' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: '認証コードを送信しました。' });

  } catch (error: any) {
    console.error('Login API Error:', error);
    return NextResponse.json({ error: 'ログイン処理に失敗しました。' }, { status: 500 });
  }
}