/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Add custom webpack config for module resolution if needed
    return config;
  },
  // Server-side environment variables are automatically available to API routes
  // We don't need to expose them to the client anymore
};

module.exports = nextConfig;
