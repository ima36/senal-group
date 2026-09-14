import type { ImageView } from '@/lib/types/view.types'

/**
 * The photographs shipped in /public, with alt text written from what is
 * actually in each frame.
 *
 * These are only used until the owner uploads their own: anything set in the
 * CMS wins, and a Media document carries its own required alt text.
 */
export const FALLBACK_ABOUT_IMAGES: ImageView[] = [
  {
    url: '/images/about-senal-2.webp',
    alt: 'A hot-air balloon drifting over a hillside city at dusk as the street lights come on.',
    width: 1000,
    height: 1000,
  },
  {
    url: '/images/about-senal-1.webp',
    alt: 'A low-rise office building in white render and glass, set behind a landscaped path.',
    width: 1000,
    height: 1000,
  },
  {
    url: '/images/about-senal-4.webp',
    alt: 'A newly finished residential block with planted balconies, lawns and young trees.',
    width: 1000,
    height: 1000,
  },
  {
    url: '/images/about-senal-3.webp',
    alt: 'A harbour city skyline lit at dusk, seen across the water from the seafront.',
    width: 1000,
    height: 1000,
  },
]

export const HERO_FALLBACK_ALT =
  'Two colleagues in business dress reviewing figures on a tablet across a glass meeting table.'

/** Keyed by the seed slug, used by scripts/seed.ts and the card fallbacks. */
export const COMPANY_FALLBACK_ALT: Record<string, string> = {
  'senal-sky': 'The Eiffel Tower above the Seine at dusk, with river boats moored along the bank.',
  'senal-site':
    'A recently completed apartment development with balconies and landscaped grounds under a clear sky.',
}
