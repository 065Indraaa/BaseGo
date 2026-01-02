import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Matikan error TypeScript saat build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Konfigurasi Webpack (Wajib untuk Metamask/Wagmi)
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
    };
    return config;
  },
};

export default nextConfig;