// app/api/jobs/route.ts
import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

// ★ リージョンを明示的に指定してクライアントを初期化
const client = new DynamoDBClient({
  region: process.env.MY_AWS_REGION || 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY || '',
  },
});

const dynamo = DynamoDBDocumentClient.from(client);
const tableName = 'NexusJobPostings';

// ==========================================
// 1. 求人一覧の取得 (GET)
// ==========================================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    const scanCommand = new ScanCommand({
      TableName: tableName,
    });

    const result = await dynamo.send(scanCommand);
    const items = result.Items || [];

    // 企業IDが指定されている場合は絞り込み、なければすべて返す
    const filteredJobs = companyId 
      ? items.filter((item: any) => item.companyId === companyId)
      : items;

    // フロントエンドの型に合わせたフォーマットに整形
    const jobs = filteredJobs.map((item: any) => ({
      id: item.jobId,
      title: item.title || '（タイトルなし）',
      employmentType: item.employmentType || '正社員',
      salary: item.salaryUnit ? `${item.salaryUnit} ${item.salaryFixed || `${item.salaryMin}〜${item.salaryMax}`}` : '給与応相談',
      location: item.prefAndCity ? `${item.prefAndCity}${item.streetNumber || ''}` : '住所未登録',
      plan: item.plan || 'スタンダードプラン',
      duration: item.duration || '3ヶ月',
      createdAt: item.createdAt || '',
      startDate: item.startDate || '2026-01-01',
      endDate: item.endDate || '2026-04-01',
      viewCount: item.viewCount || 0,
      applicantCount: item.applicantCount || 0,
      status: item.status || '公開中',
      postingLocationInfo: {
        name: item.selectedPostingLocation || '本社',
        address: item.prefAndCity || '',
      }
    }));

    return NextResponse.json({ success: true, jobs });
  } catch (error: any) {
    console.error('求人取得エラー:', error);
    return NextResponse.json({ error: true, message: error.message }, { status: 500 });
  }
}

// ==========================================
// 2. 新規求人の保存 (POST)
// ==========================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyId, jobData } = body;

    if (!companyId) {
      return NextResponse.json({ error: true, message: '企業IDがありません。' }, { status: 400 });
    }

    const jobId = 'job_' + Date.now();
    const item = {
      jobId: jobId,
      companyId: companyId,
      ...jobData,
      status: '公開中',
      viewCount: 0,
      applicantCount: 0,
      createdAt: new Date().toISOString(),
    };

    const putCommand = new PutCommand({
      TableName: tableName,
      Item: item,
    });

    await dynamo.send(putCommand);

    return NextResponse.json({
      success: true,
      jobId: jobId,
      message: '求人を正常に保存しました。',
    });
  } catch (error: any) {
    console.error('求人保存エラー:', error);
    return NextResponse.json({ error: true, message: error.message }, { status: 500 });
  }
}

// ==========================================
// 3. 求人の削除 (DELETE)
// ==========================================
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');

    if (!jobId) {
      return NextResponse.json({ error: true, message: '求人IDがありません。' }, { status: 400 });
    }

    const deleteCommand = new DeleteCommand({
      TableName: tableName,
      Key: { jobId },
    });

    await dynamo.send(deleteCommand);

    return NextResponse.json({ success: true, message: '求人を削除しました。' });
  } catch (error: any) {
    console.error('求人削除エラー:', error);
    return NextResponse.json({ error: true, message: error.message }, { status: 500 });
  }
}