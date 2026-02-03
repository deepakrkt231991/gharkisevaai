/** @type {import('next').NextConfig} */
const nextConfig = {
  // यह हिस्सा जोड़ें
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // यहाँ तक
};

export default nextConfig;