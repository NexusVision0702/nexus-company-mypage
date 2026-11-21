// app/api/public/jobs/route.ts
import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { GET as getJobs } from '@/app/api/jobs/route';

export const dynamic = 'force-dynamic';

const dynamoClient = new DynamoDBClient({
  region: process.env.MY_AWS_REGION || 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY || '',
  },
});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
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

function resolvePostingLocationInfo(job: any, company: any) {
  const selectedName =
    typeof job?.selectedPostingLocation === 'string' &&
    job.selectedPostingLocation.trim() !== ''
      ? job.selectedPostingLocation.trim()
      : '';

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
      address: hqAddress || '未登録',
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
      const storeAddr = buildFullAddress(store) || hqAddress || '未登録';
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

  const matched =
    (selectedName &&
      locations.find((loc) => loc.name === selectedName)) ||
    locations[0];

  const fallbackWorkLocation = [
    job?.prefAndCity,
    job?.streetNumber,
    job?.buildingName,
  ]
    .filter((v: any) => typeof v === 'string' && v.trim() !== '')
    .join(' ');

  return {
    name: matched?.name || selectedName || company?.companyName || '本社',
    address:
      matched?.address && matched.address !== '未登録'
        ? matched.address
        : fallbackWorkLocation || '未登録',
    phone: matched?.phone || '未登録',
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
        const res = await docClient.send(
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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    url.searchParams.set('publishedOnly', 'true');

    const limitParam = parseInt(url.searchParams.get('limit') || '30', 10);
    const offsetParam = parseInt(url.searchParams.get('offset') || '0', 10);
    const limit =
      Number.isNaN(limitParam) || limitParam <= 0
        ? 30
        : Math.min(limitParam, 100);
    const offset =
      Number.isNaN(offsetParam) || offsetParam < 0 ? 0 : offsetParam;

    const forwardedRequest = new Request(url.toString(), {
      method: 'GET',
      headers: request.headers,
    });

    const response = await getJobs(forwardedRequest);
    const data = await response.json();

    const allPublishedJobs = Array.isArray(data?.jobs)
      ? data.jobs
          .filter((job: any) => (job?.status || '公開中') === '公開中')
          .sort((a: any, b: any) => {
            const timeA = new Date(a?.updatedAt || a?.createdAt || 0).getTime();
            const timeB = new Date(b?.updatedAt || b?.createdAt || 0).getTime();
            return timeB - timeA;
          })
      : [];

    const totalCount = allPublishedJobs.length;
    const paginatedJobs = allPublishedJobs.slice(offset, offset + limit);
    const hasMore = offset + paginatedJobs.length < totalCount;

    const companyIds = paginatedJobs.map((job: any) => job?.companyId);
    const companiesMap = await fetchCompaniesMap(companyIds);

    const enrichedJobs = paginatedJobs.map((job: any) => {
      const company = job?.companyId ? companiesMap.get(job.companyId) : null;
      const postingLocationInfo = resolvePostingLocationInfo(job, company);
      return {
        ...job,
        companyName:
          (typeof company?.companyName === 'string' &&
            company.companyName.trim()) ||
          job?.companyName ||
          postingLocationInfo.name,
        postingLocationInfo,
      };
    });

    return NextResponse.json(
      {
        success: response.ok,
        jobs: enrichedJobs,
        totalCount,
        offset,
        limit,
        hasMore,
      },
      {
        status: response.status,
        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error: any) {
    console.error('公開求人APIエラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: true,
        message: error?.message || '公開求人の取得に失敗しました。',
      },
      {
        status: 500,
        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        },
      }
    );
  }
}