import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const accessKeyId = process.env.MY_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.MY_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '';
const region = process.env.MY_AWS_REGION || process.env.AWS_REGION || 'ap-northeast-1';
const TABLE_NAME = process.env.MY_DYNAMODB_COMPANY_TABLE || process.env.DYNAMODB_COMPANY_TABLE || 'nexus-job-board';

const ENCRYPTION_SECRET = crypto.createHash('sha256').update(process.env.NEXTAUTH_SECRET || process.env.RESEND_API_KEY || 'nexus-vision-secure-secret-key').digest();
const ALGORITHM = 'aes-256-gcm';

function decryptData(encryptedText: string): { email: string; verificationCode: string; expiresAt: number } | null {
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
    return JSON.parse(decrypted);
  } catch (e) {
    return null;
  }
}

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

    const cookieStore = await cookies();
    const tempAuthCookie = cookieStore.get('nexus_temp_auth');

    if (!tempAuthCookie || !tempAuthCookie.value) {
      return NextResponse.json({ error: '認証コードの有効期限が切れているか、存在しません。もう一度コードを送信してください。' }, { status: 400 });
    }

    const tokenData = decryptData(tempAuthCookie.value);
    if (!tokenData) {
      return NextResponse.json({ error: '認証情報が無効です。もう一度コードを送信してください。' }, { status: 400 });
    }

    if (tokenData.email !== email) {
      return NextResponse.json({ error: 'メールアドレスが一致しません。' }, { status: 400 });
    }

    if (Date.now() > tokenData.expiresAt) {
      return NextResponse.json({ error: '認証コードの有効期限（10分）が切れています。もう一度送信し直してください。' }, { status: 400 });
    }

    // タイミング攻撃を軽減するため timingSafeEqual を利用した安全なコード比較
    const inputCode = String(verificationCode).trim();
    const storedCode = String(tokenData.verificationCode).trim();
    
    let isCodeValid = false;
    if (inputCode.length === storedCode.length) {
      isCodeValid = crypto.timingSafeEqual(Buffer.from(inputCode), Buffer.from(storedCode));
    }

    if (!isCodeValid) {
      return NextResponse.json({ error: '認証コードが間違っています。' }, { status: 400 });
    }

    const scanResult = await docClient.send(new ScanCommand({
      TableName: TABLE_NAME,
    }));

    const inputEmail = String(email).toLowerCase().trim();
    const companyRecord = scanResult.Items?.find((doc) => {
      if (!doc.id || doc.id.startsWith('code_')) return false;
      const dbEmail = doc.email ? String(doc.email).toLowerCase().trim() : '';
      return dbEmail === inputEmail;
    });

    if (!companyRecord) {
      return NextResponse.json({ error: 'このメールアドレスで登録された企業データは存在しません。' }, { status: 401 });
    }

    const companyId = companyRecord.id;

    // 使用済みの一時Cookieを即座に破棄
    cookieStore.delete('nexus_temp_auth');

    // 本番環境ではセキュア属性（HTTPS必須、HttpOnly、SameSite=Lax）を完全に有効化
    cookieStore.set({
      name: 'nexus_company_id',
      value: companyId,
      httpOnly: true,
      secure: true, // 本番のHTTPS通信を強制
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1日間有効
    });

    return NextResponse.json({ 
      success: true, 
      companyId, 
      message: '認証に成功しました。' 
    });

  } catch (error: any) {
    console.error('Verify Code Error:', error);
    return NextResponse.json({ error: '認証処理に失敗しました。' }, { status: 500 });
  }
}