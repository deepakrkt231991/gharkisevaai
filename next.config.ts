
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
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      }
    ],
  },
};

export default nextConfig;
