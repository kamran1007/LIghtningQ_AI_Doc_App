/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,

  images: {
    domains: ["localhost", "127.0.0.1","dev.api.lightningq.com"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
  env: {
    // eslint-disable-next-line turbo/no-undeclared-env-vars, no-undef
    GOOGLEMAPSECRETEKEY: process.env.GOOGLEMAPSECRETEKEY,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Frontend route prefix
        destination: "http://127.0.0.1:8000/:path*", // Backend server
      },
    ];
  },
};

export default nextConfig;
