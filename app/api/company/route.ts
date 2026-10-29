// app/api/company/route.ts
import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

// .env.local に合わせて MY_ を付けた環境変数名から確実に読み込む
const client = new DynamoDBClient({
  region: process.env.MY_AWS_REGION || 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY || '',
  },
});
const docClient = DynamoDBDocumentClient.from(client);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId') || 'comp_1793266043558';
    const tableName = process.env.MY_DYNAMODB_COMPANY_TABLE || 'nexus-job-board';

    const command = new GetCommand({
      TableName: tableName,
      Key: { id: companyId },
    });

    const response = await docClient.send(command);

    if (!response.Item) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({ company: response.Item });
  } catch (err: any) {
    console.error('DynamoDB Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}