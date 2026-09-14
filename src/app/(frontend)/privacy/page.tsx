import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'

import BackButton from '@/lib/components/common/BackButton'
import GeneralLayout from '@/lib/components/ui/Layout/GeneralLayout'
import { getLegalDocument } from '@/lib/api/legal.actions'
import { SITE_NAME, absoluteUrl } from '@/lib/site.config'

export const revalidate = 300

const TITLE = 'Privacy Policy'

export const metadata: Metadata = {
  title: TITLE,
  description: `How ${SITE_NAME} handles the information you share with us.`,
  alternates: { canonical: absoluteUrl('/privacy') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: `How ${SITE_NAME} handles the information you share with us.`,
    url: absoluteUrl('/privacy'),
  },
}

export default async function PrivacyPage() {
  const doc = await getLegalDocument('privacy')
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
