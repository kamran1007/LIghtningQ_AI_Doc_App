import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Turbopack completely — use Webpack
  experimental: {
    turbo: false,
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },

  productionBrowserSourceMaps: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.lightningq.com",
        pathname: "/**",
      },
    ],
  },

  env: {
    GOOGLEMAPSECRETEKEY: process.env.GOOGLEMAPSECRETEKEY,
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/:path*",
      },
    ];
  },

  // Keep webpack config — allowed because Turbopack is disabled
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
