import type { NextConfig } from "next";

const API_URL = process.env.API_URL  || "http://localhost:4000/api";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/:path*`,
      },
    ];
  },
  generateBuildId: async () => {
    return process.env.BUILD_ID || crypto.randomUUID()
  },
};

export default nextConfig;