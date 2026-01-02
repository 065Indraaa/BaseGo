import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // 1. Mengatasi error modul Node.js yang hilang di browser
    config.resolve.fallback = { fs: false, net: false, tls: false };

    // 2. Mengatasi error Metamask SDK & React Native
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    // 3. Khusus untuk error @react-native-async-storage
    // Kita paksa webpack mengabaikan module ini karena kita di Web, bukan HP
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
    };

    return config;
  },
};

export default nextConfig;