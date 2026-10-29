import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

const accessKeyId = process.env.MY_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.MY_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '';
const region = process.env.MY_AWS_REGION || process.env.AWS_REGION || 'ap-northeast-1';
const TABLE_NAME = process.env.MY_DYNAMODB_COMPANY_TABLE || process.env.DYNAMODB_COMPANY_TABLE || 'nexus-job-board';

const client = new DynamoDBClient({
  region,
  credentials: { accessKeyId, secretAccessKey },
});
const docClient = DynamoDBDocumentClient.from(client);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('--- ログイン認証コード送信API開始 ---');
    console.log('受信したメールアドレス:', email);

    if (!email || !password) {
      return NextResponse.json({ error: 'メールアドレスとパスワードを入力してください。' }, { status: 400 });
    }

    // 1. DynamoDBから該当する企業データを検索
    const scanResult = await docClient.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "contactEmail = :email OR email = :email OR accountingEmail = :email OR businessEmail = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    }));

    const items = scanResult.Items || [];
    if (items.length === 0) {
      console.log('エラー: 該当する企業データが見つかりませんでした');
      return NextResponse.json({ error: 'ご入力いただいたIDまたはパスワードが正しくありません。' }, { status: 401 });
    }

    const company = items[0];

    // 2. パスワードの照合
    const storedPassword = company.password || company.companyPassword;
    if (storedPassword && storedPassword !== password) {
      console.log('エラー: パスワードが一致しません');
      return NextResponse.json({ error: 'ご入力いただいたIDまたはパスワードが正しくありません。' }, { status: 401 });
    }

    // 3. 6桁の認証コード生成
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10分有効

    // 企業データを上書きしないよう、認証コード専用のプレフィックス（code_）を用いた独立したアイテムを作成
    const codeItem = {
      id: `code_${email}`, // verify-login-code 側と完全に一致
      type: 'verification_code',
      email,
      verificationCode,
      expiresAt,
      createdAt: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: codeItem,
    }));

    // 4. Resend APIを直接 fetch で呼び出し
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'メール送信機能の環境設定（RESEND_API_KEY）が不足しています。' }, { status: 500 });
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

    console.log('Resend APIへ直接リクエスト送信中...');
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

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error('Resend API 直接送信エラー:', resendData);
      return NextResponse.json({ error: `メール送信に失敗しました: ${JSON.stringify(resendData)}` }, { status: 500 });
    }

    console.log('メール送信成功:', resendData);
    return NextResponse.json({ success: true, message: '認証コードを送信しました。' });

  } catch (error: any) {
    console.error('Login API 例外発生:', error);
    return NextResponse.json({ error: error.message || 'ログイン処理に失敗しました。' }, { status: 500 });
  }
}