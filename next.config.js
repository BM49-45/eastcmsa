/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack configuration (top-level)
  turbopack: {
    resolveAlias: {
      // Polyfills for Node.js modules
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      path: 'path-browserify',
      fs: 'memfs',
      http: 'stream-http',
      https: 'https-browserify',
      zlib: 'browserify-zlib',
      util: 'util/',
      assert: 'assert/',
      os: 'os-browserify/browser',
      buffer: 'buffer/',
    },
  },
  // Webpack fallbacks for `next build`
  webpack: (config, { isServer }) => {
    if (!isServer) {
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
        assert: require.resolve('assert/'),
        os: require.resolve('os-browserify/browser'),
        buffer: require.resolve('buffer/'),
      };
    }
    return config;
  },
  // Images configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-7729259c73e646759f7039886bf31b23.r2.dev',
        pathname: '/**',
      },
    ],
  },
  // Other options (remove swcMinify - it's enabled by default in Next.js 16)
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  // swcMinify: true,  // ❌ REMOVE THIS - it's deprecated
};

module.exports = nextConfig;