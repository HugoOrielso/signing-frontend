import type { NextConfig } from "next";

const API_URL = process.env.API_URL;

if (!API_URL) {
  throw new Error("Missing API_URL");
}

const nextConfig: NextConfig = {
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/:path*`,
      },
    ];
  },

  generateBuildId: async () => {
    return process.env.BUILD_ID || crypto.randomUUID();
  },
};

export default nextConfig;