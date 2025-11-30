import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Enable source maps in prod for debugging
  productionBrowserSourceMaps: true,

  // ✅ Allow external image domains
  images: {
    domains: ["localhost", "127.0.0.1", "dev.api.lightningq.com"],
  },

  // ✅ Allow large payloads for server actions
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },

  // ✅ Environment variables
  env: {
    GOOGLEMAPSECRETEKEY: process.env.GOOGLEMAPSECRETEKEY,
  },

  // ✅ Rewrite API calls to your backend
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/:path*", // Backend server
      },
    ];
  },

  // ✅ Fix: Ensure single React instance in local dev
  webpack: (config) => {
    if (process.env.NODE_ENV === "development") {
      config.resolve.alias = {
        ...config.resolve.alias,
        react: path.resolve(__dirname, "node_modules/react"),
        "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      };
    }
    return config;
  },
};

export default nextConfig;
