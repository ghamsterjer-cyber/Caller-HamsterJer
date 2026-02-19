
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* Базовый путь для работы в подпапке вашего основного домена */
  basePath: '/proxigram',
  /* Для Firebase Spark используем статический экспорт */
  /* Vercel проигнорирует это при деплое API-роутов, что нам и нужно */
  output: 'export',
  distDir: 'out',
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
