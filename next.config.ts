import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent Next from trying to bundle Node's native `canvas` package
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        canvas: false,
      }
    }
    return config
  },
}

export default nextConfig