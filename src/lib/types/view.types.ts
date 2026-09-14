/**
 * View models handed to components.
 *
 * Payload's generated types describe the database shape: relationships are
 * `number | Doc`, uploads are `number | Media`, and every optional field is
 * `| null`. Rather than making every component defend against that, the
 * fetchers in lib/api normalise once into these flat, always-present shapes.
 */

export type ImageView = {
  url: string
  alt: string
  width?: number
  height?: number
}

export type ContactInfo = {
  email: string
  phoneNumber1: string
  phoneNumber2: string
  address: string
  startingOpeningHour: string | null
  endingOpeningHour: string | null
}

export type TextBlock = {
  heading: string
  text: string
}

export type HeroContent = {
  heading: string
  tagline: string
  image: ImageView | null
  ctaLabel: string
}

export type AboutContent = {
  heading: string
  paragraphs: string[]
  images: ImageView[]
  mission: TextBlock
  vision: TextBlock
}

export type CeoContent = {
  heading: string
  message: string[]
  name: string
  title: string
  /** The company line — the client's signature block is three lines, not two. */
  org: string
  photo: ImageView | null
}

export type SeoContent = {
  metaTitle: string
  metaDescription: string
  ogImage: ImageView | null
}

export type SiteContent = {
  hero: HeroContent
  about: AboutContent
  ceo: CeoContent
  seo: SeoContent
}

export type CompanyView = {
  id: number
  slug: string
  name: string
  tagline: string
  description: string
  sector: string
  image: ImageView | null
  logo: ImageView | null
  externalUrl: string | null
  order: number
}
