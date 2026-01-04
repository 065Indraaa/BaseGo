import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { RootProvider } from './rootProvider';

const inter = Inter({ subsets: ['latin'] });

// 1. FIX: Viewport harus dipisah dari metadata di Next.js 14+
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
      <head>
      </head>
      <body className={inter.className}>
        <RootProvider>{children}</RootProvider>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var host=typeof location!=='undefined'?location.hostname:'';if(!/localhost|127\\.0\\.1/.test(host))return;var blocked=['cca-lite.coinbase.com','cca.coinbase.com','coinbase.com/amp','cca-lite.coinbase.com/metrics'];var isBlocked=function(u){try{return blocked.some(function(b){return u&&u.indexOf(b)!==-1});}catch(e){return false}};if(window.fetch){var _f=window.fetch;window.fetch=function(input,init){var url=typeof input==='string'?input:(input&&input.url)||'';if(isBlocked(url))return Promise.resolve(new Response(null,{status:204}));return _f.apply(this,arguments);};}
        if(window.XMLHttpRequest){var X=XMLHttpRequest.prototype;var _open=X.open;X.open=function(method,url){try{if(isBlocked(url)){this.abort();return;} }catch(e){}return _open.apply(this,arguments);};}
        if(navigator&&navigator.sendBeacon){var _sb=navigator.sendBeacon;navigator.sendBeacon=function(url,data){if(isBlocked(url))return true;return _sb.apply(this,arguments);};}
        }catch(e){}})();`
        }} />
      </body>
    </html>
  );
}
