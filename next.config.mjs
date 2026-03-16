/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  compiler: {
    // Enables SWC transforms for styled-components, optional
  },
  images: {
    // configure if you use next/image
    domains: ["eastcmsa@protonmail.com"],
  },
};