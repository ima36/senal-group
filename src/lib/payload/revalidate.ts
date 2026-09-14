import { revalidatePath, revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * Without this the owner edits a field, sees no change on the site, and
 * concludes the CMS is broken. Every collection and global that feeds a page
 * must push a revalidation when it changes.
 *
 * Wrapped in try/catch because Payload's CLI (generate:types, seed scripts,
 * migrations) runs outside a Next request scope, where these throw.
 */
const safeRevalidate = (paths: string[], tags: string[]) => {
  for (const tag of tags) {
    try {
      revalidateTag(tag)
    } catch {
      /* outside Next runtime — nothing to revalidate */
    }
  }
  for (const path of paths) {
    try {
      revalidatePath(path)
    } catch {
      /* outside Next runtime — nothing to revalidate */
    }
  }
}

type Revalidator = {
  /** Static routes that always show this content. */
  paths?: string[]
  /** Cache tags used by the fetchers that read this content. */
  tags?: string[]
}

export const revalidateAfterChange =
  ({ paths = [], tags = [] }: Revalidator): CollectionAfterChangeHook =>
  ({ doc }) => {
    safeRevalidate(paths, tags)
    return doc
  }

export const revalidateAfterDelete =
  ({ paths = [], tags = [] }: Revalidator): CollectionAfterDeleteHook =>
  ({ doc }) => {
    safeRevalidate(paths, tags)
    return doc
  }

export const revalidateGlobal =
  ({ paths = [], tags = [] }: Revalidator): GlobalAfterChangeHook =>
  ({ doc }) => {
    safeRevalidate(paths, tags)
    return doc
  }

/** Cache tags shared between the fetchers and the hooks above. */
export const CACHE_TAGS = {
  siteSettings: 'site-settings',
  companies: 'companies',
} as const
