import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // すでに何か設定があればそのままで、以下の redirects を追加します
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/dashboard/home',
        permanent: true,
      },
      {
        source: '/applicants',
        destination: '/dashboard/applicants',
        permanent: true,
      },
      {
        source: '/jobs',
        destination: '/dashboard/jobs',
        permanent: true,
      },
      {
        source: '/overview',
        destination: '/dashboard/overview',
        permanent: true,
      },
      {
        source: '/dm',
        destination: '/dashboard/dm',
        permanent: true,
      },
      {
        source: '/stores',
        destination: '/dashboard/stores',
        permanent: true,
      },
      {
        source: '/support',
        destination: '/dashboard/support',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;