import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Menambahkan header CSP untuk mengizinkan script dan style berjalan
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // Perhatikan bagian 'unsafe-eval' dan 'unsafe-inline' di bawah ini
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https: wss:;",
          },
        ],
      },
    ];
  },  eslint: {
    ignoreDuringBuilds: true,
  },};

export default nextConfig;