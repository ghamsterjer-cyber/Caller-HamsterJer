import { NextRequest, NextResponse } from 'next/server';

/**
 * Vercel Edge Engine Proxy
 * Limit: 32MB (Max for Edge Runtime)
 * Speed: Maximum (Direct streaming)
 */

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams.path);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
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
    ['content-type', 'authorization', 'accept', 'content-length'].forEach(h => {
      const v = request.headers.get(h);
      if (v) forwardHeaders.set(h, v);
    });

    const response = await fetch(telegramUrl, {
      method: request.method,
      headers: forwardHeaders,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      cache: 'no-store',
      // @ts-ignore
      duplex: 'half',
    });

    const responseHeaders = new Headers();
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    
    const respContentType = response.headers.get('content-type');
    if (respContentType) {
      responseHeaders.set('content-type', respContentType);
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Proxy Failed', 
      message: error.message 
    }, { status: 500 });
  }
}
