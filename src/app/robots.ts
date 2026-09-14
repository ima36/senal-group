import type { MetadataRoute } from 'next'

import { SITE_URL, absoluteUrl } from '@/lib/site.config'

/**
 * This file has to sit at the root of `app`, NOT inside the (frontend) route
 * group. Next matches `sitemap.ts` at any depth but anchors the robots pattern
 * to the app root (`^[\\/]robots…` in next/dist/lib/metadata/is-metadata-route),
 * so a robots.ts inside a route group is silently ignored — it compiles, it
 * never registers a route, and /robots.txt 404s with no warning.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The admin panel and the Payload REST/GraphQL endpoints are not pages.
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL,
  }
}
