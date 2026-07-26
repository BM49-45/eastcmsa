/** @type {import('next').NextConfig} */

// PWA configuration - conditionally load
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

  // Fix for Turbopack - add empty turbopack config
  turbopack: {
    // Empty config to silence the warning
  },

  // Disable optimizeCss temporarily
  experimental: {
    optimizeCss: false,
  },

  // Static generation timeout
  staticPageGenerationTimeout: 120,
}

// Only use PWA in production builds
const isProduction = process.env.NODE_ENV === 'production'

module.exports = isProduction ? withPWA(nextConfig) : nextConfig
