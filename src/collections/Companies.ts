import type { CollectionConfig } from 'payload'
import { publicRead, slugField } from '../lib/payload/fields'
import { CACHE_TAGS, revalidateAfterChange, revalidateAfterDelete } from '../lib/payload/revalidate'

/**
 * The operating companies inside the group. This drives the "Our Services"
 * section.
 *
 * It used to be two hardcoded cards (Real Estate + Travel & Tourism). There are
 * three companies now, and the CEO's message names all three by name — so the
 * section is CMS-driven and the grid copes with 1, 2 or 3+ cards.
 */
export const Companies: CollectionConfig = {
  slug: 'companies',
  labels: {
    singular: 'Company',
    plural: 'Companies',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'sector', 'order', 'updatedAt'],
    group: 'Content',
    description:
      'The cards under "Our Services" on the home page, in the order set by the Order field.',
  },
  access: publicRead,
  defaultSort: 'order',
  hooks: {
    afterChange: [revalidateAfterChange({ paths: ['/'], tags: [CACHE_TAGS.companies] })],
    afterDelete: [revalidateAfterDelete({ paths: ['/'], tags: [CACHE_TAGS.companies] })],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'e.g. "Senal Sky".' },
    },
    slugField('name'),
    {
      name: 'sector',
      type: 'text',
      required: true,
      admin: { description: 'The industry line under the card, e.g. "Travel & Tourism".' },
    },
    {
      name: 'tagline',
      type: 'text',
      admin: { description: 'One short line. Optional.' },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: { description: 'The paragraph in the card body.' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'The photo at the top of the card.' },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Optional wordmark shown above the description. Leave empty and the company name is used instead.',
      },
    },
    {
      name: 'externalUrl',
      type: 'text',
      admin: {
        description:
          'Full address of the company site, e.g. https://senalsky.com. Leave blank for a company with no site yet — the card then renders a "Coming soon" note instead of a dead button.',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return true
        return /^https?:\/\/\S+$/i.test(value.trim())
          ? true
          : 'Enter a full address starting with https:// — or leave it blank.'
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers come first.',
      },
    },
  ],
}
