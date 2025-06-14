/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost",'dummyimage.com','cdn.sunrisehospital.com']
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
  },
  env: {
    // eslint-disable-next-line turbo/no-undeclared-env-vars, no-undef
    GOOGLEMAPSECRETEKEY: process.env.GOOGLEMAPSECRETEKEY,
  },
};

export default nextConfig;
