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
const storagePlugins = process.env.BLOB_READ_WRITE_TOKEN
  ? [
      vercelBlobStorage({
        enabled: true,
        collections: { [Media.slug]: true },
        token: process.env.BLOB_READ_WRITE_TOKEN,
      }),
    ]
  : []

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
