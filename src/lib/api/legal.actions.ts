import 'server-only'

import { cache } from 'react'

import { getPayloadClient } from '@/lib/payload/client'
import type { SiteSetting } from '@/payload-types'

export type LegalKey = 'terms' | 'privacy'

/** Payload's Lexical shape for one rich-text field. */
export type LegalDocument = NonNullable<SiteSetting['terms']>

/** A Lexical document with no children is "empty" as far as publishing goes. */
const hasContent = (doc: LegalDocument | null | undefined): boolean =>
  Boolean(doc?.root?.children && doc.root.children.length > 0)

export const getLegalDocument = cache(
  async (key: LegalKey): Promise<LegalDocument | null> => {
    try {
      const payload = await getPayloadClient()
      const global = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
      const doc = global[key]
      return hasContent(doc) ? (doc ?? null) : null
    } catch (error) {
      console.error(`[legal] failed to load ${key}`, error)
      return null
    }
  },
)

/** Which legal pages actually have content — the footer only links to those. */
export const getAvailableLegalPages = cache(async (): Promise<LegalKey[]> => {
  try {
    const payload = await getPayloadClient()
    const global = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
    return (['terms', 'privacy'] as LegalKey[]).filter((key) => hasContent(global[key]))
  } catch {
    return []
  }
})
