
import type { Metadata } from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'Proxigram | Secure Telegram File Proxy',
  description: 'AI-powered secure proxy for Telegram file transfers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-background min-h-screen">
        <FirebaseClientProvider>
          {children}
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
