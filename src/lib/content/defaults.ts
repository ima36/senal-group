/**
 * Editorial defaults.
 *
 * One copy of every default string, shared by three consumers that would
 * otherwise drift apart:
 *   1. the Payload field `defaultValue`s (what a fresh CMS install shows),
 *   2. scripts/seed.ts (what a fresh database gets written),
 *   3. the fetchers in lib/api (what the page renders if the CMS is empty or
 *      unreachable).
 *
 * Plain module — no 'use server', no React — so it is safe to import from the
 * Payload config, from a tsx script and from a server component alike.
 */

export const HERO_HEADING = 'Senal Group'

/**
 * The old line was "Your Gateway to Tourism and Real Estate", which named two
 * sectors when the group now runs three. This one is lifted from the CEO's own
 * message, so it is the client's own words and covers all three.
 */
export const HERO_TAGLINE = 'Three companies. Three industries. One vision.'

export const HERO_CTA_LABEL = 'Our Companies'

export const ABOUT_HEADING = 'About Senal'

export const ABOUT_PARAGRAPHS: string[] = [
  'Senal Group is the parent company behind three businesses working across travel and tourism, construction, and import and export. Each one runs in its own market; together they share one set of standards.',
  'What holds the group together is not a single industry but a single way of working — clear commitments, delivery on time, and relationships that outlast the transaction.',
  'The group continues to grow by looking for opportunities where those standards make a difference, rather than by chasing scale for its own sake.',
]

export const MISSION_HEADING = 'Our Mission'
export const MISSION_TEXT =
  'To deliver trust, quality and lasting value in every sector we operate in — making travel, construction and trade simpler and more dependable for the people who rely on us.'

export const VISION_HEADING = 'Our Vision'
export const VISION_TEXT =
  'To be the group people turn to first across the industries we serve, recognised for doing careful work, keeping our word, and building for the long term.'

export const CEO_HEADING = 'Message From Our CEO'
export const CEO_NAME = 'Hussein Ismail'
export const CEO_TITLE = 'Chief Executive Officer'
export const CEO_ORG = 'Senal Group'

/** Exact text supplied by the client. Do not paraphrase; paragraph breaks matter. */
export const CEO_MESSAGE: string[] = [
  'At Senal Group, we believe that meaningful growth begins with a clear vision, strong values, and the courage to explore new opportunities.',
  'Our journey has grown into three distinct companies, each operating in a dynamic sector while sharing one common commitment: to deliver trust, quality, and lasting value.',
  'Through Senal Sky, we connect people with destinations and create seamless travel and tourism experiences. Through Senal Site, we transform ideas into solid realities, delivering construction solutions built with precision and responsibility. And through Senal Sea, we connect markets through reliable import and export services, building bridges for trade and opportunity.',
  'Three companies. Three industries. One vision.',
  'As Senal Group continues to grow, our focus remains on building long-term relationships, embracing new opportunities, and creating value that goes beyond business.',
  'We are not simply expanding across industries — we are building a group made to go further.',
]

/** Shape Payload wants for an array field of `{ text }` rows. */
export const asRows = (values: string[]): { text: string }[] =>
  values.map((text) => ({ text }))

/**
 * The three operating companies, in display order.
 *
 * Senal Sea has no site yet: `externalUrl` is null and its card renders a
 * "Coming soon" note rather than an Explore More button pointing nowhere.
 */
export type CompanySeed = {
  name: string
  slug: string
  sector: string
  tagline: string
  description: string
  externalUrlEnv: 'NEXT_PUBLIC_SENAL_SKY_URL' | 'NEXT_PUBLIC_SENAL_SITE_URL' | null
  order: number
  /** Static image in /public/images used by the seed when no Media doc exists. */
  fallbackImage: string | null
}

export const COMPANY_SEEDS: CompanySeed[] = [
  {
    name: 'Senal Sky',
    slug: 'senal-sky',
    sector: 'Travel & Tourism',
    tagline: 'Connecting people with destinations',
    description:
      'Senal Sky connects people with destinations. Curated packages, seasonal deals and tailor-made trips, arranged end to end so the only thing left to plan is what to do when you arrive.',
    externalUrlEnv: 'NEXT_PUBLIC_SENAL_SKY_URL',
    order: 1,
    fallbackImage: '/images/paris.webp',
  },
  {
    name: 'Senal Site',
    slug: 'senal-site',
    sector: 'Construction',
    tagline: 'Turning ideas into solid realities',
    description:
      'Senal Site turns ideas into solid realities. Construction delivered with precision and responsibility, from residential builds to commercial developments, on schedule and to specification.',
    externalUrlEnv: 'NEXT_PUBLIC_SENAL_SITE_URL',
    order: 2,
    fallbackImage: '/images/senal-site.webp',
  },
  {
    name: 'Senal Sea',
    slug: 'senal-sea',
    sector: 'Import & Export',
    tagline: 'Building bridges for trade and opportunity',
    description:
      'Senal Sea connects markets through reliable import and export services — sourcing, freight and customs handled as one chain, building bridges for trade and opportunity.',
    externalUrlEnv: null,
    order: 3,
    fallbackImage: null,
  },
]
