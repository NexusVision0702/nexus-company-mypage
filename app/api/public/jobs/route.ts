// app/api/public/jobs/route.ts
import { NextResponse } from 'next/server';
import { GET as getJobs } from '@/app/api/jobs/route';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    url.searchParams.set('publishedOnly', 'true');

    const forwardedRequest = new Request(url.toString(), {
      method: 'GET',
      headers: request.headers,
    });

    const response = await getJobs(forwardedRequest);
    const data = await response.json();

    const publishedJobs = Array.isArray(data?.jobs)
      ? data.jobs.filter((job: any) => (job?.status || '公開中') === '公開中')
      : [];

    return NextResponse.json(
      {
        success: response.ok,
        jobs: publishedJobs,
      },
      {
        status: response.status,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
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
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        },
      }
    );
  }
}