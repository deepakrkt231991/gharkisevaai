import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // इससे टाइपिंग के एरर बिल्ड नहीं रोकेंगे
    ignoreBuildErrors: true,
  },
  eslint: {
    // इससे लिंटिंग के एरर बिल्ड नहीं रोकेंगे
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
