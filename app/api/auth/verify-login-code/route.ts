import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

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
    const { email, verificationCode } = await request.json();

    if (!email || !verificationCode) {
      return NextResponse.json({ error: 'メールアドレスと認証コードを入力してください。' }, { status: 400 });
    }

    // DynamoDBから保存された認証コードを検索
    const result = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        id: `login_code_${email}`,
      },
    }));

    const item = result.Item;
    if (!item) {
      return NextResponse.json({ error: '認証コードの有効期限が切れているか、存在しません。もう一度コードを送信してください。' }, { status: 400 });
    }

    // 有効期限のチェック
    if (Date.now() > item.expiresAt) {
      return NextResponse.json({ error: '認証コードの有効期限（10分）が切れています。もう一度送信し直してください。' }, { status: 400 });
    }

    // コードの一致チェック
    if (item.verificationCode !== verificationCode.trim()) {
      return NextResponse.json({ error: '認証コードが間違っています。' }, { status: 400 });
    }

    // 認証成功したら、使用済みのコードをDynamoDBから削除（セキュリティ対策）
    await docClient.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        id: `login_code_${email}`,
      },
    }));

    return NextResponse.json({ success: true, message: '認証に成功しました。' });

  } catch (error: any) {
    console.error('Verify Code Error:', error);
    return NextResponse.json({ error: error.message || '認証処理に失敗しました。' }, { status: 500 });
  }
}