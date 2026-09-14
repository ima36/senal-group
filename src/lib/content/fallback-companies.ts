import { COMPANY_SEEDS } from '@/lib/content/defaults'
import { COMPANY_FALLBACK_ALT } from '@/lib/content/images'
import { SENAL_SITE_URL, SENAL_SKY_URL } from '@/lib/site.config'
import type { CompanyView } from '@/lib/types/view.types'

const ENV_URLS = {
  NEXT_PUBLIC_SENAL_SKY_URL: SENAL_SKY_URL,
  NEXT_PUBLIC_SENAL_SITE_URL: SENAL_SITE_URL,
} as const

/**
 * The three companies as the page should render them when the CMS has nothing
 * to say — an empty collection, or a build with no database attached.
 *
 * Without this the Our Companies section would prerender empty and stay empty
 * until the first revalidation, which is the one section on the page that must
 * never be wrong: the CEO's message names all three companies by name two
 * screens further down.
 */
export const FALLBACK_COMPANIES: CompanyView[] = COMPANY_SEEDS.map((seed, index) => ({
  id: -(index + 1),
  slug: seed.slug,
  name: seed.name,
  tagline: seed.tagline,
  description: seed.description,
  sector: seed.sector,
  image: seed.fallbackImage
    ? {
        url: seed.fallbackImage,
        alt: COMPANY_FALLBACK_ALT[seed.slug] ?? seed.name,
        width: 1200,
        height: 800,
      }
    : null,
  logo: null,
  externalUrl: seed.externalUrlEnv ? ENV_URLS[seed.externalUrlEnv] : null,
  order: seed.order,
}))
