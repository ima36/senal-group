import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/site.config'
import type { CompanyView, ContactInfo } from '@/lib/types/view.types'
import { formatDateRange } from '@/lib/utils/functions/helper.functions'

type Props = {
  contact: ContactInfo
  companies: CompanyView[]
  logoUrl?: string
}

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

/**
 * Schema.org Organization for the group, with one subOrganization per operating
 * company and a ContactPoint built from the CMS contact block.
 *
 * Everything is filtered before it is emitted: a ContactPoint with no telephone
 * and no email is worse than no ContactPoint, and a subOrganization pointing at
 * a URL that does not exist yet (Senal Sea) is emitted without `url` rather
 * than with a broken one.
 */
const stripEmpty = (value: Record<string, JsonValue | undefined>): Record<string, JsonValue> =>
  Object.fromEntries(
    Object.entries(value).filter(([, v]) => {
      if (v === undefined || v === null) return false
      if (typeof v === 'string') return v.trim().length > 0
      if (Array.isArray(v)) return v.length > 0
      return true
    }),
  ) as Record<string, JsonValue>

export const OrganizationJsonLd = ({ contact, companies, logoUrl }: Props) => {
  const { days, time } = formatDateRange(contact.startingOpeningHour, contact.endingOpeningHour)

  const telephones = [contact.phoneNumber1, contact.phoneNumber2]
    .map((phone) => phone?.trim())
    .filter((phone): phone is string => Boolean(phone))

  const contactPoint = stripEmpty({
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: contact.email,
    telephone: telephones[0],
    areaServed: 'Worldwide',
    availableLanguage: ['en', 'ar'],
    hoursAvailable: days && time ? `${days} ${time}` : undefined,
  })

  const subOrganizations = companies.map((company) =>
    stripEmpty({
      '@type': 'Organization',
      name: company.name,
      description: company.description,
      url: company.externalUrl ?? undefined,
      parentOrganization: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      knowsAbout: company.sector,
    }),
  )

  const data = stripEmpty({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: logoUrl ?? absoluteUrl('/images/senal-group.webp'),
    email: contact.email,
    telephone: telephones[0],
    address: contact.address
      ? stripEmpty({ '@type': 'PostalAddress', streetAddress: contact.address })
      : undefined,
    contactPoint: Object.keys(contactPoint).length > 1 ? [contactPoint] : undefined,
    subOrganization: subOrganizations,
  })

  return (
    <script
      type="application/ld+json"
      // The payload is built here from typed values, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export const WebSiteJsonLd = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        publisher: { '@id': `${SITE_URL}/#organization` },
      }),
    }}
  />
)

export default OrganizationJsonLd
