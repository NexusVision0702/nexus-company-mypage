// app/api/jobs/route.ts
import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand, DeleteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

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

    const filteredJobs = companyId 
      ? items.filter((item: any) => item.companyId === companyId)
      : items;

    const jobs = filteredJobs.map((item: any) => {
      const rawLocationName = item.selectedPostingLocation || '本社';
      const match = rawLocationName.match(/\((.*?)\)/);
      const extractedAddress = match ? match[1] : '';
      const cleanName = rawLocationName.replace(/\s*\(.*?\)/g, '');

      const fullAddress = extractedAddress || 
        `${item.prefAndCity || ''}${item.streetNumber || ''}${item.buildingName || ''}` || 
        '住所未登録';

      return {
        ...item,
        id: item.jobId,
        title: item.title || '（タイトルなし）',
        employmentType: item.employmentType || '正社員',
        salary: item.salaryUnit ? `${item.salaryUnit} ${item.salaryFixed || `${item.salaryMin}〜${item.salaryMax}`}` : (item.salary || '給与応相談'),
        location: item.prefAndCity ? `${item.prefAndCity}${item.streetNumber || ''}` : (item.location || '住所未登録'),
        plan: item.plan || 'スタンダードプラン',
        duration: item.duration || '3ヶ月',
        createdAt: item.createdAt || '',
        startDate: item.startDate || '2026-01-01',
        endDate: item.endDate || '2026-04-01',
        listPvCount: item.listPvCount || 0,
        detailPvCount: item.detailPvCount || 0,
        applicantCount: item.applicantCount || 0,
        status: item.status || '公開中',
        postingLocationInfo: {
          name: cleanName,
          address: fullAddress,
        }
      };
    });

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
      listPvCount: 0,
      detailPvCount: 0,
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
// 2.5. 既存求人の上書き保存 (PUT) ★ 追加
// ==========================================
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { companyId, jobId, jobData } = body;

    if (!companyId || !jobId) {
      return NextResponse.json({ error: true, message: '企業IDまたは求人IDがありません。' }, { status: 400 });
    }

    // 既存のデータを上書き保存（既存のPV数などはそのまま維持したい場合はスキャンしてマージも可能ですが、Putで更新します）
    const item = {
      jobId: jobId,
      companyId: companyId,
      ...jobData,
      updatedAt: new Date().toISOString(),
    };

    const putCommand = new PutCommand({
      TableName: tableName,
      Item: item,
    });

    await dynamo.send(putCommand);

    return NextResponse.json({
      success: true,
      jobId: jobId,
      message: '求人を正常に更新しました。',
    });
  } catch (error: any) {
    console.error('求人更新エラー:', error);
    return NextResponse.json({ error: true, message: error.message }, { status: 500 });
  }
}

// ==========================================
// 3. PV数のカウントアップ (PATCH)
// ==========================================
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');
    const type = searchParams.get('type');

    if (!jobId) {
      return NextResponse.json({ error: true, message: '求人IDがありません。' }, { status: 400 });
    }

    const updateField = type === 'detail' ? 'detailPvCount' : 'listPvCount';

    const updateCommand = new UpdateCommand({
      TableName: tableName,
      Key: { jobId },
      UpdateExpression: `ADD ${updateField} :inc`,
      ExpressionAttributeValues: { ':inc': 1 },
      ReturnValues: 'ALL_NEW',
    });

    const result = await dynamo.send(updateCommand);

    return NextResponse.json({ success: true, updatedAttributes: result.Attributes });
  } catch (error: any) {
    console.error('PV更新エラー:', error);
    return NextResponse.json({ error: true, message: error.message }, { status: 500 });
  }
}

// ==========================================
// 4. 求人の削除 (DELETE)
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