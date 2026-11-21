// app/api/public/jobs/route.ts
import { NextResponse } from 'next/server';
import { GET as getJobs } from '@/app/api/jobs/route';

export const dynamic = 'force-dynamic';

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
      ? data.jobs.filter((job: any) => (job?.status || '公開中') === '公開中')
      : [];

    const totalCount = allPublishedJobs.length;
    const paginatedJobs = allPublishedJobs.slice(offset, offset + limit);
    const hasMore = offset + paginatedJobs.length < totalCount;

    return NextResponse.json(
      {
        success: response.ok,
        jobs: paginatedJobs,
        totalCount,
        offset,
        limit,
        hasMore,
      },
      {
        status: response.status,
        headers: {
          'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30',
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
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}