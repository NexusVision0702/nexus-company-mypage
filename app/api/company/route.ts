import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { cookies } from 'next/headers';

const client = new DynamoDBClient({
  region: process.env.MY_AWS_REGION || 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY || '',
  },
});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.MY_DYNAMODB_COMPANY_TABLE || 'nexus-job-board';

// 1. 企業データの取得 (GET - 全属性返却)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    let companyId: string | null | undefined = searchParams.get('companyId');
    if (!companyId) {
      const cookieStore = await cookies();
      companyId = cookieStore.get('nexus_company_id')?.value;
    }

    const targetCompanyId = companyId || 'comp_1793266043558';

    const command = new GetCommand({
      TableName: tableName,
      Key: { id: targetCompanyId },
    });

    const response = await docClient.send(command);

    if (!response.Item) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({ company: response.Item });
  } catch (err: any) {
    console.error('DynamoDB GET Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 2. 企業データの更新・保存 (PUT - 動的マージ更新により既存データを消さない)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    const cookieStore = await cookies();
    const cookieCompanyId = cookieStore.get('nexus_company_id')?.value;

    const companyId = body.companyId || cookieCompanyId || 'comp_1793266043558';

    // 許容する更新対象のキー一覧
    const allowedKeys = [
      'companyName', 'corporateNumber', 'corporateType', 'invoiceNumber',
      'representativeName', 'licenseNumber', 'capital', 'establishYear',
      'establishMonth', 'establishDay', 'industry', 'employeeRegular',
      'employeePart', 'contactName', 'accountingContactName', 'phone',
      'contactEmail', 'email', 'accountingEmail', 'homepageUrl', 'branchType',
      'postalCode', 'prefecture', 'city', 'addressSub', 'businessPhone',
      'businessEmail', 'businessDescription', 'newsletter', 'stores'
    ];

    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    // リクエストボディに含まれていた項目だけを動的にUpdateExpressionに追加
    for (const key of allowedKeys) {
      if (body[key] !== undefined) {
        // DynamoDBの予約語（emailなど）対策
        const attrNameKey = key === 'email' ? '#em' : `#${key}`;
        const attrValKey = `:${key}`;

        if (key === 'email') {
          expressionAttributeNames['#em'] = 'email';
        } else {
          expressionAttributeNames[`#${key}`] = key;
        }

        updateExpressions.push(`${attrNameKey} = ${attrValKey}`);
        expressionAttributeValues[attrValKey] = body[key];
      }
    }

    if (updateExpressions.length === 0) {
      return NextResponse.json({ error: '更新するデータがありません。' }, { status: 400 });
    }

    const command = new UpdateCommand({
      TableName: tableName,
      Key: { id: companyId },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    });

    const response = await docClient.send(command);

    return NextResponse.json({ success: true, company: response.Attributes });
  } catch (err: any) {
    console.error('DynamoDB UPDATE Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}