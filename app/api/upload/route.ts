// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.MY_AWS_REGION || 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.MY_AWS_S3_BUCKET_NAME || 'nexus-job-images-bucket';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: true, message: 'ファイルがありません。' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // 元のファイル名のスペースをアンダーバーに置換
    const originalName = file.name.replace(/\s+/g, '_');
    const timestamp = Date.now();
    
    // S3上のキー（保存名）
    const fileName = `jobs/${timestamp}_${originalName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    // ★ URLのファイル名部分を安全にエンコードして公開URLを生成
    const encodedFileName = `jobs/${timestamp}_${encodeURIComponent(originalName)}`;
    const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${encodedFileName}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error: any) {
    console.error('S3アップロードエラー:', error);
    return NextResponse.json({ error: true, message: error.message }, { status: 500 });
  }
}