import type { GlobalConfig } from 'payload'
import { CACHE_TAGS, revalidateGlobal } from '../lib/payload/revalidate'
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
  asRows,
} from '../lib/content/defaults'

/**
 * Everything editorial on senalgroup.com plus the contact block.
 *
 * The contact tab is read by the header, the footer, the Get In Touch form and
 * the ContactPoint in the Organization JSON-LD — it is site-wide, not just the
 * home page, which is why the global is called Site Settings rather than
 * Home Page.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings & Contact',
  admin: {
    group: 'Content',
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [
      revalidateGlobal({
        paths: ['/', '/terms', '/privacy'],
        tags: [CACHE_TAGS.siteSettings],
      }),
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'heroHeading',
              type: 'text',
              required: true,
              defaultValue: HERO_HEADING,
              admin: { description: 'The accessible name of the wordmark at the top of the page.' },
            },
            {
              name: 'heroTagline',
              type: 'text',
              defaultValue: HERO_TAGLINE,
              admin: {
                description:
                  'One line under the wordmark. Keep it true of all three companies — the previous "Tourism and Real Estate" line left Senal Sea out.',
              },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'The full-bleed background photo. Landscape, at least 1920px wide. A dark scrim is applied over it automatically, so the text stays readable whatever you upload.',
              },
            },
            {
              name: 'heroCtaLabel',
              type: 'text',
              defaultValue: HERO_CTA_LABEL,
              admin: { description: 'Label on the button that scrolls down to Our Services.' },
            },
          ],
        },
        {
          label: 'About',
          fields: [
            {
              name: 'aboutHeading',
              type: 'text',
              defaultValue: ABOUT_HEADING,
            },
            {
              name: 'aboutParagraphs',
              type: 'array',
              labels: { singular: 'Paragraph', plural: 'Paragraphs' },
              defaultValue: asRows(ABOUT_PARAGRAPHS),
              fields: [{ name: 'text', type: 'textarea', required: true }],
            },
            {
              name: 'aboutImages',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: {
                description:
                  'The collage beside the text. Four images fills the grid; fewer still lays out cleanly.',
              },
            },
            {
              name: 'mission',
              type: 'group',
              fields: [
                { name: 'heading', type: 'text', defaultValue: MISSION_HEADING },
                { name: 'text', type: 'textarea', defaultValue: MISSION_TEXT },
              ],
            },
            {
              name: 'vision',
              type: 'group',
              fields: [
                { name: 'heading', type: 'text', defaultValue: VISION_HEADING },
                { name: 'text', type: 'textarea', defaultValue: VISION_TEXT },
              ],
            },
          ],
        },
        {
          label: 'CEO Message',
          fields: [
            {
              name: 'ceoHeading',
              type: 'text',
              defaultValue: CEO_HEADING,
            },
            {
              name: 'ceoMessage',
              type: 'array',
              labels: { singular: 'Paragraph', plural: 'Paragraphs' },
              defaultValue: asRows(CEO_MESSAGE),
              admin: { description: 'One row per paragraph. The breaks are the client’s own.' },
              fields: [{ name: 'text', type: 'textarea', required: true }],
            },
            { name: 'ceoName', type: 'text', defaultValue: CEO_NAME },
            { name: 'ceoTitle', type: 'text', defaultValue: CEO_TITLE },
            { name: 'ceoOrg', type: 'text', defaultValue: CEO_ORG },
            {
              name: 'ceoPhoto',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Optional. Leave it empty and the page draws a designed placeholder mark instead — there is no broken-image state.',
              },
            },
          ],
        },
        {
          label: 'Contact',
          description:
            'Used by the footer, the Get In Touch form and the structured data search engines read.',
          fields: [
            {
              name: 'email',
              type: 'email',
              required: true,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'phoneNumber1',
                  type: 'text',
                  admin: {
                    width: '50%',
                    description:
                      'Used for the WhatsApp link. Digits and country code only, no "+" or spaces — e.g. 96170123456.',
                  },
                },
                { name: 'phoneNumber2', type: 'text', admin: { width: '50%' } },
              ],
            },
            {
              name: 'address',
              type: 'textarea',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'startingOpeningHour',
                  type: 'date',
                  admin: {
                    width: '50%',
                    date: { pickerAppearance: 'dayAndTime' },
                    description: 'The weekday and time the week opens on, e.g. Monday 09:00.',
                  },
                },
                {
                  name: 'endingOpeningHour',
                  type: 'date',
                  admin: {
                    width: '50%',
                    date: { pickerAppearance: 'dayAndTime' },
                    description: 'The weekday and time the week closes on, e.g. Saturday 17:00.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Legal',
          description:
            'Leave a field empty and its page returns 404 and disappears from the footer — better for SEO than publishing an empty legal page.',
          fields: [
            {
              name: 'terms',
              type: 'richText',
              label: 'Terms & Conditions',
            },
            {
              name: 'privacy',
              type: 'richText',
              label: 'Privacy Policy',
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              admin: { description: 'Falls back to the site default if left blank.' },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              maxLength: 200,
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'The image shown when the page is shared. 1200×630.' },
            },
          ],
        },
      ],
    },
  ],
}
