import type { MetadataRoute } from 'next'

import { getAvailableLegalPages } from '@/lib/api/legal.actions'
import { absoluteUrl } from '@/lib/site.config'

/** Regenerated with the rest of the site rather than frozen at build time. */
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const entries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]

  // Only list a legal page when it actually has content — the page 404s
  // otherwise, and a sitemap full of 404s costs crawl budget.
  const legal = await getAvailableLegalPages()
  for (const key of legal) {
    entries.push({
      url: absoluteUrl(`/${key}`),
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    })
  }

  return entries
}
