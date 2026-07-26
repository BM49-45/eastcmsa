/** @type {import('next').NextConfig} */

// PWA configuration
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

const nextConfig = {
  images: {
    unoptimized: true,
  },
  output: 'standalone',

  // MUHIMU: Ongeza turbopack config
  turbopack: {
    // Empty config to silence the warning
  },

  experimental: {
    optimizeCss: false,
  },

  staticPageGenerationTimeout: 120,
}

// Only use PWA in production
const isProduction = process.env.NODE_ENV === 'production'

export default isProduction ? withPWA(nextConfig) : nextConfig
