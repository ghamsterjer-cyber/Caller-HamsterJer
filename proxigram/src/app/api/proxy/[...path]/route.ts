
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Оптимизированный прокси с поддержкой высокоскоростного стриминга.
 * На Railway этот код будет пропускать до 100МБ+ без ограничений.
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
    const headersToForward = ['content-type', 'content-length', 'authorization'];
    
    headersToForward.forEach(header => {
      const value = request.headers.get(header);
      if (value) forwardHeaders.set(header, value);
    });

    // Оптимизированная передача тела запроса для тяжелых файлов (видео/аудио)
    let requestBody: any = null;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      // Используем стрим напрямую для минимизации потребления RAM на Railway
      requestBody = request.body;
    }

    const response = await fetch(telegramUrl, {
      method: request.method,
      headers: forwardHeaders,
      body: requestBody,
      cache: 'no-store',
      // @ts-ignore - необходимо для Node.js среды в Railway
      duplex: 'half',
    });

    const responseHeaders = new Headers();
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    
    const respContentType = response.headers.get('content-type');
    if (respContentType) {
      responseHeaders.set('content-type', respContentType);
    }

    // Возвращаем поток (stream) напрямую пользователю
    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error('High-Load Proxy Error:', error);
    return NextResponse.json({ 
      error: 'Proxy Transfer Failed', 
      message: error.message,
      hint: 'Если файл > 4.5MB, убедитесь что вы используете домен Railway, а не Vercel.'
    }, { status: 500 });
  }
}
