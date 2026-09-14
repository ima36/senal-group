import type { Metadata } from 'next'

import GeneralLayout from '@/lib/components/ui/Layout/GeneralLayout'
import { getSiteContent } from '@/lib/api/site-settings.actions'
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  absoluteUrl,
} from '@/lib/site.config'

import HomePage from './home/HomePage'

/**
 * ISR. The page is fully static between revalidations, and every Payload
 * fetcher returns safe defaults if the database is unreachable — which is how
 * `next build` succeeds with no database attached.
 */
export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const { seo, hero } = await getSiteContent()

  const title = seo.metaTitle || `${SITE_NAME} — ${hero.tagline || SITE_TAGLINE}`
  const description = seo.metaDescription || SITE_DESCRIPTION
  const image = seo.ogImage?.url ?? DEFAULT_OG_IMAGE

  return {
    // `absolute` so the site-wide "%s | Senal Group" template does not append
    // the brand name to a title that already ends in it.
    title: { absolute: title },
    description,
    alternates: { canonical: absoluteUrl('/') },
    openGraph: {
      type: 'website',
      title,
      description,
      url: absoluteUrl('/'),
      siteName: SITE_NAME,
      images: [{ url: image, alt: seo.ogImage?.alt || SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default function Home() {
  return (
    <GeneralLayout>
      <main id="main" className="flex min-h-screen w-full flex-col items-center">
        <HomePage />
      </main>
    </GeneralLayout>
  )
}
