import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Companies } from './collections/Companies'
import { SiteSettings } from './globals/SiteSettings'
import { SITE_URL } from './lib/site.config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Vercel Blob is only wired when a token is present. Locally the default disk
 * adapter takes over, so `next dev` works with no cloud credentials at all.
 */
/*
 * The plugin is ALWAYS registered and switched off through `enabled`, never
 * added conditionally.
 *
 * Registering it conditionally made the generated admin importMap depend on
 * whether a token happened to be in the environment at generation time. Run
 * `generate:importmap` locally, where there is no token, and the plugin is
 * absent, so its client component never lands in the map. Deploy to Vercel,
 * where the token IS set, and Payload looks up
 * `@payloadcms/storage-vercel-blob/client#VercelBlobClientUploadHandler`,
 * fails to resolve it, and renders the entire admin panel as an empty page —
 * no error in the browser console, because the failure is server-side.
 *
 * With `enabled` doing the switching the component is always in the map, so
 * the map is identical whoever generates it and wherever it runs.
 */
const storagePlugins = [
  vercelBlobStorage({
    enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    collections: { [Media.slug]: true },
    token: process.env.BLOB_READ_WRITE_TOKEN ?? '',
  }),
]

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' — Senal Group',
    },
  },
  collections: [Users, Media, Companies],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    ...storagePlugins,
    seoPlugin({
      collections: ['companies'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `${(doc as { name?: string })?.name ?? ''} | Senal Group`,
      generateDescription: ({ doc }) => (doc as { description?: string })?.description ?? '',
      generateURL: () => SITE_URL,
    }),
  ],
  cors: [SITE_URL].filter(Boolean),
  csrf: [SITE_URL].filter(Boolean),
})
