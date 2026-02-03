import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  // यह लाइन जोड़ें
  output: 'standalone', 
};

export default nextConfig;