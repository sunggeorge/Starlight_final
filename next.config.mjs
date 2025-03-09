/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: '**.istockphoto.com',
      },
      {
        hostname: '**.unsplash.com',
      },
      {
        hostname: '**.pexels.com',
      },
      {
        protocol: "https", // Use the HTTPS protocol for secure requests
        hostname: "scontent.cdninstagram.com", // Instagram CDN hostname
        pathname: "/**", // Allow all paths under this hostname
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default nextConfig;



