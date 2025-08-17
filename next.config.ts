import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // 本番ビルドで ESLint を有効化（以前の回避を戻す）
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
