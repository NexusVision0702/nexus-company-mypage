// app/api/jobs/route.ts
import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  DeleteCommand,
  UpdateCommand,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.MY_AWS_REGION || 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY || '',
  },
});

const dynamo = DynamoDBDocumentClient.from(client);
const tableName = 'NexusJobPostings';
const companyTableName =
  process.env.MY_DYNAMODB_COMPANY_TABLE || 'nexus-job-board';

function buildFullAddress(obj: any): string {
  if (!obj || typeof obj !== 'object') return '';

  const prefCity = [obj.prefecture, obj.city]
    .filter((v: any) => typeof v === 'string' && v.trim() !== '')
    .map((v: string) => v.trim())
    .join('');

  const detailCandidates = [
    obj.addressLine,
    obj.addressSub,
    obj.streetNumber,
    obj.addressDetail,
    obj.addressLine2,
    obj.buildingName,
    obj.building,
  ]
    .filter((v: any) => typeof v === 'string' && v.trim() !== '')
    .map((v: string) => v.trim());

  const uniqueDetails = detailCandidates.filter(
    (v, idx, arr) => arr.indexOf(v) === idx
  );
  const detailStr = uniqueDetails.join('');

  if (prefCity) {
    return `${prefCity}${detailStr}`;
  }

  const rawAddress =
    typeof obj.address === 'string' ? obj.address.trim() : '';
  if (rawAddress && detailStr && !rawAddress.includes(detailStr)) {
    return `${rawAddress}${detailStr}`;
  }
  return rawAddress || detailStr;
}

function buildPostingLocationInfo(item: any, company: any) {
  const rawLocationName =
    typeof item?.selectedPostingLocation === 'string' &&
    item.selectedPostingLocation.trim() !== ''
      ? item.selectedPostingLocation.trim()
      : '本社';

  const match = rawLocationName.match(/\((.*?)\)/);
  const extractedAddress = match ? match[1].trim() : '';
  const cleanName = rawLocationName.replace(/\s*\(.*?\)/g, '').trim() || '本社';

  const hqName =
    typeof company?.branchType === 'string' && company.branchType.trim() !== ''
      ? company.branchType.trim()
      : '本社';
  const hqAddress = buildFullAddress(company);
  const hqPhone =
    (typeof company?.businessPhone === 'string' &&
      company.businessPhone.trim()) ||
    (typeof company?.phone === 'string' && company.phone.trim()) ||
    '未登録';
  const hqEmployees = company?.employeeRegular
    ? `${company.employeeRegular}名`
    : '非公開';
  const hqHours = '9:00 〜 18:00';

  const locations = [
    {
      name: hqName,
      address: hqAddress,
      phone: hqPhone,
      employees: hqEmployees,
      hours: hqHours,
    },
  ];

  if (Array.isArray(company?.stores)) {
    company.stores.forEach((store: any, idx: number) => {
      if (!store || typeof store !== 'object') return;
      const storeName =
        typeof store.name === 'string' && store.name.trim() !== ''
          ? store.name.trim()
          : `${company?.companyName || '店舗'} ${idx + 1}`;
      const storeAddr = buildFullAddress(store);
      locations.push({
        name: storeName,
        address: storeAddr,
        phone:
          (typeof store.phone === 'string' && store.phone.trim()) || hqPhone,
        employees:
          (typeof store.employees === 'string' && store.employees.trim()) ||
          '非公開',
        hours:
          (typeof store.hours === 'string' && store.hours.trim()) ||
          '9:00 〜 18:00',
      });
    });
  }

  const matched = locations.find((loc) => loc.name === cleanName);

  const resolvedAddress =
    (matched?.address && matched.address.trim()) ||
    extractedAddress ||
    '住所未登録';

  return {
    name: matched?.name || cleanName,
    address: resolvedAddress,
    phone: matched?.phone || hqPhone || '未登録',
    employees: matched?.employees || '非公開',
    hours: matched?.hours || '9:00 〜 18:00',
  };
}

async function fetchCompaniesMap(companyIds: string[]) {
  const map = new Map<string, any>();
  const uniqueIds = Array.from(
    new Set(
      companyIds.filter((id) => typeof id === 'string' && id.trim() !== '')
    )
  );

  await Promise.all(
    uniqueIds.map(async (id) => {
      try {
        const res = await dynamo.send(
          new GetCommand({
            TableName: companyTableName,
            Key: { id },
          })
        );
        if (res.Item) {
          map.set(id, res.Item);
        }
      } catch (err) {
        console.error(`企業データ取得エラー (companyId=${id}):`, err);
      }
    })
  );

  return map;
}

// ==========================================
// 1. 求人一覧の取得 (GET)
// ==========================================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const statusParam = searchParams.get('status');
    const publishedOnly = searchParams.get('publishedOnly') === 'true';

    const scanCommand = new ScanCommand({
      TableName: tableName,
    });

    const result = await dynamo.send(scanCommand);
    const items = result.Items || [];

    const filteredJobs = items.filter((item: any) => {
      const matchesCompany = companyId ? item.companyId === companyId : true;
      const currentStatus = item.status || '公開中';

      if (publishedOnly) {
        return matchesCompany && currentStatus === '公開中';
      }
      if (statusParam && statusParam !== 'すべて') {
        return matchesCompany && currentStatus === statusParam;
      }
      return matchesCompany;
    });

    const companiesMap = await fetchCompaniesMap(
      filteredJobs.map((item: any) => item?.companyId)
    );

    const jobs = filteredJobs
      .map((item: any) => {
        const company = item?.companyId ? companiesMap.get(item.companyId) : null;
        const postingLocationInfo = buildPostingLocationInfo(item, company);

        return {
          ...item,
          id: item.jobId,
          title: item.title || '（タイトルなし）',
          employmentType: item.employmentType || '正社員',
          salary: item.salaryUnit
            ? `${item.salaryUnit} ${item.salaryFixed || `${item.salaryMin}〜${item.salaryMax}`}`
            : item.salary || '給与応相談',
          location: item.prefAndCity
            ? `${item.prefAndCity}${item.streetNumber || ''}`
            : item.location || '住所未登録',
          plan: item.plan || 'スタンダードプラン',
          duration: item.duration || '3ヶ月',
          createdAt: item.createdAt || '',
          updatedAt: item.updatedAt || '',
          startDate: item.startDate || '2026-01-01',
          endDate: item.endDate || '2026-04-01',
          listPvCount: item.listPvCount || 0,
          detailPvCount: item.detailPvCount || 0,
          applicantCount: item.applicantCount || 0,
          status: item.status || '公開中',
          postingLocationInfo,
        };
      })
      .sort((a: any, b: any) => {
        const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return timeB - timeA;
      });

    return NextResponse.json(
      { success: true, jobs },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
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

    const now = new Date().toISOString();
    const jobId = 'job_' + Date.now();
    const item = {
      jobId: jobId,
      companyId: companyId,
      ...jobData,
      status: jobData?.status || '公開中',
      listPvCount: 0,
      detailPvCount: 0,
      applicantCount: 0,
      createdAt: now,
      updatedAt: now,
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
// 2.5. 既存求人の上書き保存 (PUT)
// ==========================================
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { companyId, jobId, jobData } = body;

    if (!companyId || !jobId) {
      return NextResponse.json({ error: true, message: '企業IDまたは求人IDがありません。' }, { status: 400 });
    }

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