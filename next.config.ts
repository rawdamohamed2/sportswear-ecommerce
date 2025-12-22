import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
    reactStrictMode: true,
    experimental: {
        turbopackFileSystemCacheForDev: false,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'source.unsplash.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'api.dicebear.com',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
