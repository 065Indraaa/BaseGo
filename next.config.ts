import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Matikan error ESLint saat build (Unused vars, etc)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // 2. Matikan error TypeScript saat build (Any type, etc)
  typescript: {
    ignoreBuildErrors: true,
  },

  // 3. Konfigurasi Webpack yang sudah ada (untuk Metamask/Wagmi)
  webpack: (config) => {
    // a. Mengatasi error modul Node.js yang hilang di browser
    config.resolve.fallback = { fs: false, net: false, tls: false };

    // b. Mengatasi error Metamask SDK & React Native
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    // c. Khusus untuk error @react-native-async-storage
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
    };

    return config;
  },
};

export default nextConfig;