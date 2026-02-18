
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams.path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams.path);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    },
  });
}

async function handleRequest(request: NextRequest, pathSegments: string[]) {
  if (!pathSegments || pathSegments.length === 0) {
    return NextResponse.json({ error: 'No path provided' }, { status: 400 });
  }

  const path = pathSegments.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const telegramUrl = `https://api.telegram.org/${path}${searchParams ? '?' + searchParams : ''}`;

  try {
    const forwardHeaders = new Headers();
    const contentType = request.headers.get('content-type');
    if (contentType) forwardHeaders.set('content-type', contentType);
    
    let body: any = undefined;
    if (request.method === 'POST') {
      body = await request.arrayBuffer();
    }

    const response = await fetch(telegramUrl, {
      method: request.method,
      headers: forwardHeaders,
      body: body,
      cache: 'no-store',
    });

    const data = await response.arrayBuffer();
    const responseHeaders = new Headers();
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    
    const respContentType = response.headers.get('content-type');
    if (respContentType) {
      responseHeaders.set('content-type', respContentType);
    }

    return new NextResponse(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
