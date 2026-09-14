import 'server-only'

import { cache } from 'react'

import { getPayloadClient } from '@/lib/payload/client'
import { toCompany } from '@/lib/payload/map'
import type { CompanyView } from '@/lib/types/view.types'

/**
 * The Our Companies cards.
 *
 * Returns [] rather than throwing when the CMS is unreachable — the section
 * then renders its own empty state and the rest of the page is unaffected.
 * `next build` runs with no database, and this is the path it takes.
 */
export const getCompanies = cache(async (): Promise<CompanyView[]> => {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'companies',
      depth: 1,
      limit: 24,
      sort: 'order',
    })

    return result.docs.map(toCompany)
  } catch (error) {
    console.error('[companies] failed to load companies', error)
    return []
  }
})
