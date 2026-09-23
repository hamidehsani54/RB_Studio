import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// On Vercel, default the public site address to the project's production domain
// (set NEXT_PUBLIC_SERVER_URL explicitly once a custom domain such as rbstudio.se is added).
if (!process.env.NEXT_PUBLIC_SERVER_URL && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
  process.env.NEXT_PUBLIC_SERVER_URL = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
}

const nextConfig: NextConfig = {
  // Don't auto-generate AGENTS.md / CLAUDE.md in the project folder.
  agentRules: false,
  images: {
    // Photographs are served as AVIF (or WebP as fallback) at the exact size each screen needs.
    formats: ['image/avif', 'image/webp'],
    qualities: [80],
    deviceSizes: [480, 640, 828, 1080, 1280, 1600, 1920, 2560],
    imageSizes: [64, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    localPatterns: [{ pathname: '/api/media/file/**' }, { pathname: '/brand/**' }],
  },
  async headers() {
    return [
      {
        source: '/api/media/file/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
      },
      {
        source: '/brand/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800' }],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
