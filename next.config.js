const withImages = require('next-images')
const path = require('path')
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // To allow config to be accessible to both client and server-side.
  env: {
    NAME: process.env.NAME,
    DESCRIPTION: process.env.DESCRIPTION,
    CUSTOM_ENV: process.env.CUSTOM_ENV,
    WORK_TRIAL_API_URL: process.env.WORK_TRIAL_API_URL,
  },
  exclude: path.resolve(__dirname, 'public/svgs'),
  webpack(config, options) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
      exclude: path.resolve(__dirname, 'public/images'),
    })

    return config
  },
}

module.exports = withImages(nextConfig)
