import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'

import BackButton from '@/lib/components/common/BackButton'
import GeneralLayout from '@/lib/components/ui/Layout/GeneralLayout'
import { getLegalDocument } from '@/lib/api/legal.actions'
import { SITE_NAME, absoluteUrl } from '@/lib/site.config'

export const revalidate = 300

const TITLE = 'Terms & Conditions'

export const metadata: Metadata = {
  title: TITLE,
  description: `The terms that apply to using the ${SITE_NAME} website.`,
  alternates: { canonical: absoluteUrl('/terms') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: `The terms that apply to using the ${SITE_NAME} website.`,
    url: absoluteUrl('/terms'),
  },
}

/**
 * Empty means 404. Publishing a legal page with no text in it is worse than not
 * having one: it is a thin page for search engines and a dead end for readers.
 */
export default async function TermsPage() {
  const doc = await getLegalDocument('terms')
  if (!doc) notFound()

  return (
    <GeneralLayout>
      <main id="main" className="w-full pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="mx-auto flex w-[86%] max-w-3xl flex-col gap-8">
          <BackButton fallbackHref="/" label="Back to home" className="self-start" />
          <h1 className="text-3xl font-bold text-charcoal md:text-4xl">{TITLE}</h1>
          <div className="h-1 w-24 rounded-full bg-gold" aria-hidden="true" />
          <div className="rich-text text-charcoal">
            <RichText data={doc} />
          </div>
        </div>
      </main>
    </GeneralLayout>
  )
}
