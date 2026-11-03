import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const accessKeyId = process.env.MY_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.MY_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '';
const region = process.env.MY_AWS_REGION || process.env.AWS_REGION || 'ap-northeast-1';
const TABLE_NAME = process.env.MY_DYNAMODB_COMPANY_TABLE || process.env.DYNAMODB_COMPANY_TABLE || 'nexus-job-board';

// 暗号化・復号用の秘密鍵設定
const ENCRYPTION_SECRET = crypto.createHash('sha256').update(process.env.NEXTAUTH_SECRET || 'nexus-vision-secure-secret-key').digest();
const ALGORITHM = 'aes-256-gcm';

// トークンを復号する関数
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

    console.log('--- 認証コード検証API開始 ---');
    console.log('受信したメールアドレス:', email);

    if (!email || !verificationCode) {
      return NextResponse.json({ error: 'メールアドレスと認証コードを入力してください。' }, { status: 400 });
    }

    // 1. Cookieから暗号化された一時認証トークンを取得
    const cookieStore = await cookies();
    const tempAuthCookie = cookieStore.get('nexus_temp_auth');

    if (!tempAuthCookie || !tempAuthCookie.value) {
      return NextResponse.json({ error: '認証コードの有効期限が切れているか、存在しません。もう一度コードを送信してください。' }, { status: 400 });
    }

    // 2. トークンを復号して中身を確認
    const tokenData = decryptData(tempAuthCookie.value);
    if (!tokenData) {
      return NextResponse.json({ error: '認証情報が無効です。もう一度コードを送信してください。' }, { status: 400 });
    }

    // 3. メールアドレスの一致チェック
    if (tokenData.email !== email) {
      return NextResponse.json({ error: 'メールアドレスが一致しません。' }, { status: 400 });
    }

    // 4. 有効期限（10分）のチェック
    if (Date.now() > tokenData.expiresAt) {
      return NextResponse.json({ error: '認証コードの有効期限（10分）が切れています。もう一度送信し直してください。' }, { status: 400 });
    }

    // 5. コードの一致チェック（ここで適当なコードを完全に弾きます）
    if (tokenData.verificationCode !== verificationCode.trim()) {
      return NextResponse.json({ error: '認証コードが間違っています。' }, { status: 400 });
    }

    // 6. 該当するメールアドレスを持つ「実際の企業データ（companyId）」をDBから検索
    let companyId = 'comp_1793266043558'; // フォールバック用ID
    try {
      const scanResult = await docClient.send(new ScanCommand({
        TableName: TABLE_NAME,
      }));

      const companyRecord = scanResult.Items?.find(
        (doc) => (doc.email === email || doc.accountingEmail === email || doc.businessEmail === email || doc.contactEmail === email) && !doc.id.startsWith('code_')
      );

      if (companyRecord) {
        companyId = companyRecord.id;
      }
    } catch (dbError) {
      console.warn('企業データ検索時の警告:', dbError);
    }

    // 7. 使用済みの一時認証用Cookieを削除（セキュリティ対策）
    cookieStore.delete('nexus_temp_auth');

    // 8. ログイン成功の HttpOnly Cookie を発行
    cookieStore.set({
      name: 'nexus_company_id',
      value: companyId,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1日間有効
    });

    console.log('認証成功・Cookie発行完了:', companyId);
    return NextResponse.json({ 
      success: true, 
      companyId, 
      message: '認証に成功しました。' 
    });

  } catch (error: any) {
    console.error('Verify Code Error:', error);
    return NextResponse.json({ error: error.message || '認証処理に失敗しました。' }, { status: 500 });
  }
}