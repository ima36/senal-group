import type { CollectionConfig, Field, FieldHook } from 'payload'

/** Lowercase, strip accents, collapse anything non-alphanumeric into single dashes. */
export const slugify = (input: string): string =>
  input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Fills the slug from `sourceField` when the editor leaves it blank, and
 * normalises whatever they typed when they don't. Never silently overwrites a
 * slug that already exists — changing one breaks live URLs.
 */
const formatSlug =
  (sourceField: string): FieldHook =>
  ({ data, operation, originalDoc, value }) => {
    if (typeof value === 'string' && value.length > 0) return slugify(value)

    // Only auto-generate on create, or when the slug was never set.
    if (operation === 'create' || !originalDoc?.slug) {
      const source = data?.[sourceField] ?? originalDoc?.[sourceField]
      if (typeof source === 'string' && source.length > 0) return slugify(source)
    }

    return value
  }

export const slugField = (sourceField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'Used in the page URL. Leave blank to generate it automatically.',
  },
  hooks: {
    beforeValidate: [formatSlug(sourceField)],
  },
})

/** Anyone can read published content; only logged-in editors can change it. */
export const publicRead: CollectionConfig['access'] = {
  read: () => true,
  create: ({ req }) => Boolean(req.user),
  update: ({ req }) => Boolean(req.user),
  delete: ({ req }) => Boolean(req.user),
}
