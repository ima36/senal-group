/**
 * Seeds a fresh database with the site's editorial content and the three
 * operating companies.
 *
 *   npm run seed
 *
 * Safe to re-run. Companies are matched on `slug`: an existing one is updated,
 * a missing one is created, and nothing is ever deleted. Images shipped in
 * /public are uploaded into the Media collection the first time and reused
 * afterwards, so the run is not idempotent-by-accident — it is idempotent by
 * design.
 *
 * Requires DATABASE_URI and PAYLOAD_SECRET in .env.
 */
// Must come first: payload.config.ts reads process.env at module scope.
import './load-env'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { getPayload } from 'payload'
import type { Payload } from 'payload'

import config from '../src/payload.config'
import {
  ABOUT_HEADING,
  ABOUT_PARAGRAPHS,
  CEO_HEADING,
  CEO_MESSAGE,
  CEO_NAME,
  CEO_TITLE,
  COMPANY_SEEDS,
  HERO_CTA_LABEL,
  HERO_HEADING,
  HERO_TAGLINE,
  MISSION_HEADING,
  MISSION_TEXT,
  VISION_HEADING,
  VISION_TEXT,
  asRows,
} from '../src/lib/content/defaults'
import { COMPANY_FALLBACK_ALT, FALLBACK_ABOUT_IMAGES, HERO_FALLBACK_ALT } from '../src/lib/content/images'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(dirname, '..', 'public')

/**
 * Uploads a file from /public into Media, or returns the id of the copy that is
 * already there. Matching is on filename, which is what Payload stores.
 */
async function ensureMedia(
  payload: Payload,
  publicPath: string,
  alt: string,
): Promise<number | null> {
  const filename = path.basename(publicPath)
  const filePath = path.join(publicDir, publicPath.replace(/^\//, ''))

  if (!fs.existsSync(filePath)) {
    console.warn(`  ! ${filename} is not in /public — skipping this image`)
    return null
  }

  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })

  const found = existing.docs[0]
  if (found) {
    console.log(`  · media ${filename} already uploaded (#${found.id})`)
    return found.id
  }

  const created = await payload.create({
    collection: 'media',
    data: { alt },
    filePath,
  })

  console.log(`  + uploaded ${filename} (#${created.id})`)
  return created.id
}

async function seedSiteSettings(payload: Payload) {
  console.log('\nSite Settings & Contact')

  const heroImage = await ensureMedia(payload, '/images/senal-group.webp', HERO_FALLBACK_ALT)

  const aboutImages: number[] = []
  for (const image of FALLBACK_ABOUT_IMAGES) {
    const id = await ensureMedia(payload, image.url, image.alt)
    if (id !== null) aboutImages.push(id)
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      heroHeading: HERO_HEADING,
      heroTagline: HERO_TAGLINE,
      heroCtaLabel: HERO_CTA_LABEL,
      ...(heroImage !== null ? { heroImage } : {}),

      aboutHeading: ABOUT_HEADING,
      aboutParagraphs: asRows(ABOUT_PARAGRAPHS),
      ...(aboutImages.length > 0 ? { aboutImages } : {}),
      mission: { heading: MISSION_HEADING, text: MISSION_TEXT },
      vision: { heading: VISION_HEADING, text: VISION_TEXT },

      ceoHeading: CEO_HEADING,
      ceoMessage: asRows(CEO_MESSAGE),
      ceoName: CEO_NAME,
      ceoTitle: CEO_TITLE,
      // ceoPhoto is deliberately left unset: there is no photograph of the CEO
      // yet, and the page draws its own placeholder rather than a stock face.

      // Contact details are the owner's to fill in; a placeholder address here
      // would end up in the JSON-LD and in front of customers.
      email: process.env.SEED_CONTACT_EMAIL || 'info@senalgroup.com',

      metaTitle: `${HERO_HEADING} — ${HERO_TAGLINE}`,
      metaDescription:
        'Senal Group is the parent company behind Senal Sky, Senal Site and Senal Sea — travel and tourism, construction, and import and export.',
    },
  })

  console.log('  ✓ global written')
}

async function seedCompanies(payload: Payload) {
  console.log('\nCompanies')

  for (const seed of COMPANY_SEEDS) {
    const imageId = seed.fallbackImage
      ? await ensureMedia(payload, seed.fallbackImage, COMPANY_FALLBACK_ALT[seed.slug] ?? seed.name)
      : null

    const externalUrl = seed.externalUrlEnv
      ? (process.env[seed.externalUrlEnv] ?? '').replace(/\/$/, '')
      : ''

    const data = {
      name: seed.name,
      slug: seed.slug,
      sector: seed.sector,
      tagline: seed.tagline,
      description: seed.description,
      order: seed.order,
      // Senal Sea has no site yet. An empty string keeps the card's
      // "Website coming soon" state rather than linking nowhere.
      externalUrl,
      ...(imageId !== null ? { image: imageId } : {}),
    }

    const existing = await payload.find({
      collection: 'companies',
      where: { slug: { equals: seed.slug } },
      limit: 1,
    })

    const found = existing.docs[0]
    if (found) {
      await payload.update({ collection: 'companies', id: found.id, data })
      console.log(`  ~ updated ${seed.name}`)
    } else {
      await payload.create({ collection: 'companies', data })
      console.log(`  + created ${seed.name}`)
    }
  }
}

async function main() {
  if (!process.env.DATABASE_URI) {
    throw new Error('DATABASE_URI is not set — copy .env.example to .env first.')
  }

  const payload = await getPayload({ config })

  await seedSiteSettings(payload)
  await seedCompanies(payload)

  console.log('\nDone. Log in at /admin to fill in the contact details.\n')
  process.exit(0)
}

main().catch((error) => {
  console.error('\nSeed failed:', error)
  process.exit(1)
})
