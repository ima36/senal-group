import 'server-only'

import { cache } from 'react'

import { getPayloadClient } from '@/lib/payload/client'
import { toImage, toImages, toParagraphs } from '@/lib/payload/map'
import {
  ABOUT_HEADING,
  ABOUT_PARAGRAPHS,
  CEO_HEADING,
  CEO_MESSAGE,
  CEO_NAME,
  CEO_ORG,
  CEO_TITLE,
  HERO_CTA_LABEL,
  HERO_HEADING,
  HERO_TAGLINE,
  MISSION_HEADING,
  MISSION_TEXT,
  VISION_HEADING,
  VISION_TEXT,
} from '@/lib/content/defaults'
import type { ContactInfo, SiteContent } from '@/lib/types/view.types'

const EMPTY_CONTACT: ContactInfo = {
  email: '',
  phoneNumber1: '',
  phoneNumber2: '',
  address: '',
  startingOpeningHour: null,
  endingOpeningHour: null,
}

/**
 * What the page renders when the CMS is empty or unreachable.
 *
 * `next build` runs with no database, so this is exactly what gets prerendered.
 * It has to be a complete, sensible page — not a screenful of blanks.
 */
const FALLBACK_CONTENT: SiteContent = {
  hero: {
    heading: HERO_HEADING,
    tagline: HERO_TAGLINE,
    image: null,
    ctaLabel: HERO_CTA_LABEL,
  },
  about: {
    heading: ABOUT_HEADING,
    paragraphs: ABOUT_PARAGRAPHS,
    images: [],
    mission: { heading: MISSION_HEADING, text: MISSION_TEXT },
    vision: { heading: VISION_HEADING, text: VISION_TEXT },
  },
  ceo: {
    heading: CEO_HEADING,
    message: CEO_MESSAGE,
    name: CEO_NAME,
    title: CEO_TITLE,
    org: CEO_ORG,
    photo: null,
  },
  seo: { metaTitle: '', metaDescription: '', ogImage: null },
}

/**
 * Contact details, read by the header, the footer, the Get In Touch form and
 * the ContactPoint in the JSON-LD.
 *
 * `cache()` keeps the layout and the page from issuing the same query twice in
 * one request. Never throws — a CMS hiccup must not take the whole page down.
 */
export const getContactInfo = cache(async (): Promise<ContactInfo> => {
  try {
    const payload = await getPayloadClient()
    const doc = await payload.findGlobal({ slug: 'site-settings', depth: 0 })

    return {
      email: doc.email ?? '',
      phoneNumber1: doc.phoneNumber1 ?? '',
      phoneNumber2: doc.phoneNumber2 ?? '',
      address: doc.address ?? '',
      startingOpeningHour: doc.startingOpeningHour ?? null,
      endingOpeningHour: doc.endingOpeningHour ?? null,
    }
  } catch (error) {
    console.error('[site-settings] failed to load contact info', error)
    return EMPTY_CONTACT
  }
})

/** Every editorial block on the home page, normalised into view models. */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  try {
    const payload = await getPayloadClient()
    const doc = await payload.findGlobal({ slug: 'site-settings', depth: 1 })

    const heading = doc.heroHeading || HERO_HEADING
    const aboutHeading = doc.aboutHeading || ABOUT_HEADING
    const aboutParagraphs = toParagraphs(doc.aboutParagraphs)
    const ceoMessage = toParagraphs(doc.ceoMessage)

    return {
      hero: {
        heading,
        tagline: doc.heroTagline || HERO_TAGLINE,
        image: toImage(doc.heroImage, heading),
        ctaLabel: doc.heroCtaLabel || HERO_CTA_LABEL,
      },
      about: {
        heading: aboutHeading,
        paragraphs: aboutParagraphs.length ? aboutParagraphs : ABOUT_PARAGRAPHS,
        images: toImages(doc.aboutImages, aboutHeading),
        mission: {
          heading: doc.mission?.heading || MISSION_HEADING,
          text: doc.mission?.text || MISSION_TEXT,
        },
        vision: {
          heading: doc.vision?.heading || VISION_HEADING,
          text: doc.vision?.text || VISION_TEXT,
        },
      },
      ceo: {
        heading: doc.ceoHeading || CEO_HEADING,
        message: ceoMessage.length ? ceoMessage : CEO_MESSAGE,
        name: doc.ceoName || CEO_NAME,
        title: doc.ceoTitle || CEO_TITLE,
        org: doc.ceoOrg || CEO_ORG,
        photo: toImage(doc.ceoPhoto, doc.ceoName || CEO_NAME),
      },
      seo: {
        metaTitle: doc.metaTitle ?? '',
        metaDescription: doc.metaDescription ?? '',
        ogImage: toImage(doc.ogImage, doc.metaTitle || HERO_HEADING),
      },
    }
  } catch (error) {
    console.error('[site-settings] failed to load site content', error)
    return FALLBACK_CONTENT
  }
})
