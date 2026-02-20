import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // Использование Edge Runtime для обхода лимита 4.5МБ
export const dynamic = 'force-dynamic';

/**
 * Оптимизированный внутренний прокси на базе Edge Runtime.
 * Позволяет передавать файлы до 32 МБ с максимальной скоростью Vercel.
 * Ссылка: /api/proxy/bot<TOKEN>/...
 */
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
    const headersToForward = ['content-type', 'authorization', 'x-requested-with'];
    
    headersToForward.forEach(header => {
      const value = request.headers.get(header);
      if (value) forwardHeaders.set(header, value);
    });

    // Оптимизированная передача тела запроса (Streaming)
    // Edge Runtime позволяет передавать потоки напрямую
    const response = await fetch(telegramUrl, {
      method: request.method,
      headers: forwardHeaders,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      cache: 'no-store',
      // @ts-ignore - необходимо для стриминга в Edge Runtime
      duplex: 'half',
    });

    const responseHeaders = new Headers();
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    
    const respContentType = response.headers.get('content-type');
    if (respContentType) {
      responseHeaders.set('content-type', respContentType);
    }

    // Возвращаем поток напрямую пользователю для экономии памяти и времени
    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error('Edge Proxy Error:', error);
    return NextResponse.json({ 
      error: 'Proxy Transfer Failed', 
      message: error.message 
    }, { status: 500 });
  }
}
