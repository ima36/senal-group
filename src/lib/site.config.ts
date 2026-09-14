/**
 * Single source of truth for anything that needs the site's public origin:
 * metadataBase, canonical URLs, the sitemap, robots.txt, JSON-LD and CORS.
 *
 * Set NEXT_PUBLIC_SITE_URL in the environment. On Vercel,
 * VERCEL_PROJECT_PRODUCTION_URL is filled in automatically, which keeps preview
 * deployments self-consistent.
 */
const fromEnv =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined)

export const SITE_URL = (fromEnv || 'https://senalgroup.com').replace(/\/$/, '')

/** The two operating companies that already have sites of their own. */
export const SENAL_SKY_URL = (
  process.env.NEXT_PUBLIC_SENAL_SKY_URL || 'https://senalsky.com'
).replace(/\/$/, '')

export const SENAL_SITE_URL = (
  process.env.NEXT_PUBLIC_SENAL_SITE_URL || 'https://senalsite.com'
).replace(/\/$/, '')

export const SITE_NAME = 'Senal Group'
export const SITE_TAGLINE = 'Three companies. Three industries. One vision.'
export const SITE_DESCRIPTION =
  'Senal Group is the parent company behind Senal Sky, Senal Site and Senal Sea — travel and tourism, construction, and import and export.'

/** Absolute URL helper. Accepts "/terms" or "terms". */
export const absoluteUrl = (path = '/') =>
  `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`

/**
 * Fallback share image. The CMS `ogImage` overrides this when one is uploaded;
 * without a fallback a shared link renders as a bare grey card.
 */
export const DEFAULT_OG_IMAGE = absoluteUrl('/images/senal-group.webp')
