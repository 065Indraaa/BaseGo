import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@coinbase/onchainkit/styles.css'; // <--- WAJIB ADA
import { RootProvider } from './rootProvider';

const inter = Inter({ subsets: ['latin'] });

// Viewport export terpisah (Next.js 14+)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#2563EB',
};

export const metadata: Metadata = {
  title: 'BaseGo Merchant',
  description: 'Aplikasi Kasir Crypto berbasis Base Network',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}