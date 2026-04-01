import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
    
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Em produção você usará SSL
        hostname: '**',    // O asterisco duplo permite qualquer hostname (menos seguro, mas resolve)
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5097',
      },
    ],
  },
};

export default nextConfig;
