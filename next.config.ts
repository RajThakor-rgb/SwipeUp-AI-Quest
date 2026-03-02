import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // For GitHub Pages: replace 'swipeup-ai-quest' with your actual repo name
  // If using a custom domain, you can remove the basePath line
  basePath: process.env.NODE_ENV === 'production' ? '/SwipeUp-AI-Quest' : '',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
