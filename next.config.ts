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
};

export default nextConfig;
