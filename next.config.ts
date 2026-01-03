import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  webpack: (config) => {
    // 1. Mengatasi error modul Node.js yang hilang di browser
    config.resolve = config.resolve || {};
    config.resolve.fallback = { ...(config.resolve.fallback || {}), fs: false, net: false, tls: false };

    // 2. Hindari bundling modul server-only di browser
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
      'lokijs': false,
      'encoding': false,
    };

    // 3. Tambahkan externals bila memungkinkan
    if (Array.isArray(config.externals)) {
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
    }

    return config;
  },
};

export default nextConfig;
