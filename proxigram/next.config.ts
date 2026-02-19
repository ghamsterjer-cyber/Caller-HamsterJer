
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* Базовый путь для работы в подпапке вашего основного домена */
  basePath: '/proxigram',
  /* ВАЖНО: Мы убираем output: 'export', так как Vercel должен запустить сервер для прокси */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
