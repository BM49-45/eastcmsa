/** @type {import('next').NextConfig} */
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
  // Disable optimizeCss temporarily to fix critters error
  experimental: {
    optimizeCss: false, // Change this from true to false
  },
  // Add this to handle static generation
  staticPageGenerationTimeout: 120,
}

module.exports = withPWA(nextConfig)