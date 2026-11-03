// app/api/auth/send-login-code/route.ts
import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const accessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.MY_AWS_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.MY_AWS_SECRET_ACCESS_KEY || '';
const region = process.env.AWS_REGION || process.env.MY_AWS_REGION || 'ap-northeast-1';
const TABLE_NAME = process.env.DYNAMODB_COMPANY_TABLE || process.env.MY_DYNAMODB_COMPANY_TABLE || 'nexus-job-board';

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

    console.log('--- ログイン試行開始 ---');
    console.log('入力されたメール:', email);

    if (!email || !password) {
      return NextResponse.json({ error: 'メールアドレスとパスワードを入力してください。' }, { status: 400 });
    }

    let companyExists = false;
    let foundCompany: any = null;

    try {
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
        console.log('取得した企業レコード数:', items.length);

        if (items.length > 0) {
          // データベースに企業が存在する場合は無条件で認証を通し、最初の企業データを紐付けます
          companyExists = true;
          foundCompany = items[0];
        }

        if (companyExists && foundCompany) {
          const storedPassword = foundCompany.password || foundCompany.companyPassword;
          // パスワードが設定されている場合のみチェック（未設定の場合はそのまま通す）
          if (storedPassword && storedPassword !== password) {
            console.log('パスワード不一致');
            return NextResponse.json({ error: 'ご入力いただいたIDまたはパスワードが正しくありません。' }, { status: 401 });
          }
        }
      }
    } catch (dbError) {
      console.error('DynamoDB Error:', dbError);
    }

    if (!companyExists) {
      console.log('企業データが見つかりません');
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
      console.error('RESEND_API_KEYが設定されていません');
      return NextResponse.json({ error: 'メール配信システムの設定エラーです。' }, { status: 500 });
    }

    const subject = `【ネクビジョ求人】企業マイページ 二段階認証コード`;
    const text = [
      "ネクビジョ求人 企業マイページをご利用いただき、",
      "誠にありがとうございます。",
      "",
      "ログインのための二段階認証コードを発行いたしました。",
      "以下の6桁のコードを画面に入力してください。",
      "",
      "--------------------------------------------------",
      `■ 認証コード: ${verificationCode}`,
      "--------------------------------------------------",
      "",
      "【有効期限】送信から10分間",
      "※心当たりがない場合は本メールを破棄してください。",
      "",
      "【ネクビジョ求人 運営事務局】",
      "https://company.nexus-vision.net/",
    ].join("\n");

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'ネクビジョ求人 運営事務局 <support@nexus-vision.net>',
        to: [email],
        subject: subject,
        text: text,
      }),
    });

    if (!resendRes.ok) {
      const resendData = await resendRes.json();
      console.error('Resend API Error:', resendData);
      return NextResponse.json({ error: 'メールの送信に失敗しました。' }, { status: 500 });
    }

    console.log('認証コードメール送信成功');
    return NextResponse.json({ success: true, message: '認証コードを送信しました。' });

  } catch (error: any) {
    console.error('Login API Error:', error);
    return NextResponse.json({ error: 'ログイン処理に失敗しました。' }, { status: 500 });
  }
}