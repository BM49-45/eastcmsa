/** @type {import('next').NextConfig} */
const nextConfig = {
  // If you're using Turbopack (next dev --turbopack)
  experimental: {
    turbo: {
      resolveAlias: {
        // Provide polyfills for Node.js modules
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
        path: 'path-browserify',
        fs: 'memfs',
        http: 'stream-http',
        https: 'https-browserify',
        zlib: 'browserify-zlib',
        util: 'util/',
      },
    },
  },
  // For webpack builds (next build)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve Node.js modules on the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        path: require.resolve('path-browserify'),
        fs: false,
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        zlib: require.resolve('browserify-zlib'),
        util: require.resolve('util/'),
      };
    }
    return config;
  },
};

module.exports = nextConfig;