import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const blobHost = process.env.NEXT_PUBLIC_BLOB_HOSTNAME

const nextConfig: NextConfig = {
  images: {
    // Payload serves media from /api/media/file/* locally and from Vercel Blob
    // in production. Both are covered below.
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com', pathname: '/**' },
      ...(blobHost ? [{ protocol: 'https' as const, hostname: blobHost, pathname: '/**' }] : []),
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
