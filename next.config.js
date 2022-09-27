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
    ETH_RPC: process.env.ETH_RPC,
    ETH_CHAIN_ID: process.env.ETH_CHAIN_ID,
    FLAG_SHOW_LAUNCH_PAGE: process.env.FLAG_SHOW_LAUNCH_PAGE,
    FLAG_SHOW_ETH_WALLET: process.env.FLAG_SHOW_ETH_WALLET,
    FLAG_SHOW_DEPRECATED_TOKEN: process.env.FLAG_SHOW_DEPRECATED_TOKEN,
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
  async redirects() {
    return [
      process.env.FLAG_SHOW_LAUNCH_PAGE === 'true'
        ? null
        : {
            source: '/launch',
            destination: '/',
            permanent: true,
          },
    ].filter((item) => item !== null)
  },
}

module.exports = withImages(nextConfig)
