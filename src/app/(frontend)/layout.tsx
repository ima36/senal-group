import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import type { PropsWithChildren } from 'react'

import ClientLoadingWrapper from '@/lib/components/common/ClientLoadingWrapper'
import { OrganizationJsonLd, WebSiteJsonLd } from '@/lib/components/common/JsonLd'
import { getCompanies } from '@/lib/api/companies.actions'
import { getContactInfo } from '@/lib/api/site-settings.actions'
import { FALLBACK_COMPANIES } from '@/lib/content/fallback-companies'
import { ContactProvider } from '@/lib/providers/ContactProvider'
import { NavigationProvider } from '@/lib/providers/NavigationProvider'
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from '@/lib/site.config'

import '../../lib/styles/globals.scss'

/**
 * Only the four weights the site actually uses are declared.
 *
 * next/font preloads every face it is given, and the seven-weight list this was
 * ported from put ~690 KB of woff2 in a render-blocking preload on every page —
 * three of which (Thin 100, Light 300, Black 900) are not referenced by a single
 * class anywhere. The files are still in src/lib/styles/Font if a design ever
 * needs them; add the weight back here at that point.
 */
const montserrat = localFont({
  src: [
    { path: '../../lib/styles/Font/Montserrat-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../lib/styles/Font/Montserrat-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../lib/styles/Font/Montserrat-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../../lib/styles/Font/Montserrat-Bold.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  fallback: ['system-ui', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'en',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: { icon: '/favicon.ico' },
}

export const viewport: Viewport = {
  themeColor: '#1A1A1A',
}

export default async function FrontendLayout({ children }: PropsWithChildren) {
  // Fetched once here, server-side, and handed down. cache() keeps the page's
  // own call to getContactInfo from hitting the database a second time.
  const [contact, companies] = await Promise.all([getContactInfo(), getCompanies()])
  const cards = companies.length > 0 ? companies : FALLBACK_COMPANIES

  return (
    <html lang="en">
      <body className={montserrat.className}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-charcoal focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <NavigationProvider>
          <ContactProvider value={contact}>
            <ClientLoadingWrapper>{children}</ClientLoadingWrapper>
          </ContactProvider>
        </NavigationProvider>
        <OrganizationJsonLd contact={contact} companies={cards} />
        <WebSiteJsonLd />
      </body>
    </html>
  )
}
