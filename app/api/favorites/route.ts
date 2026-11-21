import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.MY_AWS_REGION || 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY || '',
  },
});

const dynamo = DynamoDBDocumentClient.from(client);
const resumesTableName =
  process.env.MY_DYNAMODB_RESUMES_TABLE || 'NexusJobResumes';

function normalizeEmail(raw: unknown): string {
  return typeof raw === 'string' ? raw.trim().toLowerCase() : '';
}

function normalizeJobIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of raw) {
    const id =
      typeof item === 'string' ? item.trim() : String(item ?? '').trim();
    if (id && !seen.has(id)) {
      seen.add(id);
      result.push(id);
    }
  }
  return result;
}

// お気に入り求人ID一覧の取得 (GET /api/favorites?email=...)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = normalizeEmail(searchParams.get('email'));

    if (!email) {
      return NextResponse.json(
        { error: true, message: 'メールアドレスが必要です。' },
        { status: 400 }
      );
    }

    const res = await dynamo.send(
      new GetCommand({
        TableName: resumesTableName,
        Key: { email },
        ProjectionExpression: 'email, favoriteJobIds',
      })
    );

    const favoriteJobIds = normalizeJobIds(res.Item?.favoriteJobIds);

    return NextResponse.json(
      { success: true, email, favoriteJobIds },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('お気に入り取得エラー:', error);
    const message =
      error instanceof Error
        ? error.message
        : 'お気に入りの取得に失敗しました。';
    return NextResponse.json({ error: true, message }, { status: 500 });
  }
}

// お気に入りの追加・解除 (POST /api/favorites)
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = normalizeEmail(body?.email);
    const jobId =
      typeof body?.jobId === 'string'
        ? body.jobId.trim()
        : String(body?.jobId ?? '').trim();
    const shouldFavorite = body?.favorite !== false;

    if (!email || !jobId) {
      return NextResponse.json(
        { error: true, message: 'email と jobId は必須です。' },
        { status: 400 }
      );
    }

    const currentRes = await dynamo.send(
      new GetCommand({
        TableName: resumesTableName,
        Key: { email },
        ProjectionExpression: 'email, favoriteJobIds',
      })
    );

    const currentSet = new Set<string>(
      normalizeJobIds(currentRes.Item?.favoriteJobIds)
    );
    if (shouldFavorite) {
      currentSet.add(jobId);
    } else {
      currentSet.delete(jobId);
    }

    const updatedIds = Array.from(currentSet);
    const now = new Date().toISOString();

    await dynamo.send(
      new UpdateCommand({
        TableName: resumesTableName,
        Key: { email },
        UpdateExpression: 'SET favoriteJobIds = :ids, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':ids': updatedIds,
          ':updatedAt': now,
        },
      })
    );

    return NextResponse.json({
      success: true,
      email,
      jobId,
      isFavorite: shouldFavorite,
      favoriteJobIds: updatedIds,
    });
  } catch (error) {
    console.error('お気に入り更新エラー:', error);
    const message =
      error instanceof Error
        ? error.message
        : 'お気に入りの更新に失敗しました。';
    return NextResponse.json({ error: true, message }, { status: 500 });
  }
}