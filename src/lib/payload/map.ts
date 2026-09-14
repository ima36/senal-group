import type { Company, Media } from '@/payload-types'
import type { CompanyView, ImageView } from '@/lib/types/view.types'

/**
 * Payload returns `number | Doc` for every relationship: the id when depth is 0,
 * the populated document when depth is high enough. These guards keep that
 * ambiguity in one file instead of spreading `typeof x === 'object'` through
 * every component.
 */
const isPopulated = <T extends { id: number }>(
  value: number | T | null | undefined,
): value is T => typeof value === 'object' && value !== null

export const toImage = (
  value: number | Media | null | undefined,
  fallbackAlt = '',
): ImageView | null => {
  if (!isPopulated<Media>(value)) return null
  const url = value.url
  if (!url) return null
  return {
    url,
    alt: value.alt || fallbackAlt,
    width: value.width ?? undefined,
    height: value.height ?? undefined,
  }
}

export const toImages = (
  value: (number | Media)[] | null | undefined,
  fallbackAlt = '',
): ImageView[] =>
  (value ?? [])
    .map((item) => toImage(item, fallbackAlt))
    .filter((img): img is ImageView => img !== null)

/** Trims and drops empties, so a blank CMS row never renders as an empty <p>. */
export const toParagraphs = (
  value: { text?: string | null }[] | null | undefined,
): string[] =>
  (value ?? [])
    .map((item) => item.text?.trim() ?? '')
    .filter((text): text is string => text.length > 0)

/**
 * An external URL is only usable if it is an absolute http(s) link. Anything
 * else (a blank field, a stray "TBC") becomes null so the card renders its
 * "coming soon" state instead of a dead button.
 */
const toExternalUrl = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim()
  if (!trimmed) return null
  return /^https?:\/\//i.test(trimmed) ? trimmed.replace(/\/$/, '') : null
}

export const toCompany = (doc: Company): CompanyView => ({
  id: doc.id,
  slug: doc.slug ?? String(doc.id),
  name: doc.name,
  tagline: doc.tagline ?? '',
  description: doc.description ?? '',
  sector: doc.sector ?? '',
  image: toImage(doc.image, doc.name),
  logo: toImage(doc.logo, `${doc.name} logo`),
  externalUrl: toExternalUrl(doc.externalUrl),
  order: doc.order ?? 0,
})
