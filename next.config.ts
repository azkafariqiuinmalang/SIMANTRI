import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mengizinkan akses dev server dari IP lokal (LAN / WiFi)
  allowedDevOrigins: [
    '192.168.1.*',
    '192.168.*.*',
    'localhost',
    '127.0.0.1',
    '*.local',
  ],
  async redirects() {
    return [
      {
        source: '/privacy-policy',
        destination: '/privacy',
        permanent: true,
      },
      {
        source: '/terms-of-service',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/terms-and-conditions',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/data-deletion-instructions',
        destination: '/data-deletion',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
