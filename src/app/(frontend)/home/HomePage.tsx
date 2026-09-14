import { getCompanies } from '@/lib/api/companies.actions'
import { getContactInfo, getSiteContent } from '@/lib/api/site-settings.actions'
import { FALLBACK_COMPANIES } from '@/lib/content/fallback-companies'
import { whatsappLink } from '@/lib/utils/functions/helper.functions'

import AboutSenal from './_features/components/AboutSenal'
import GetInTouch from './_features/components/GetInTouch'
import HeroSection from './_features/components/HeroSection'
import MessageFromCeo from './_features/components/MessageFromCeo'
import OurCompanies from './_features/components/OurCompanies'

/**
 * The whole page is a server component. Only three things are client islands:
 * the header drawer, the hero's IntersectionObserver, and the contact form.
 * Everything a crawler needs is in the first HTML response.
 */
export const HomePage = async () => {
  const [content, contact, companies] = await Promise.all([
    getSiteContent(),
    getContactInfo(),
    getCompanies(),
  ])

  // An unreachable or unseeded CMS must not leave the group with no companies.
  const cards = companies.length > 0 ? companies : FALLBACK_COMPANIES

  return (
    <>
      <HeroSection
        hero={content.hero}
        whatsappHref={whatsappLink(contact.phoneNumber1, contact.phoneNumber2)}
      />
      <AboutSenal about={content.about} />
      <OurCompanies companies={cards} />
      <MessageFromCeo ceo={content.ceo} />
      <GetInTouch />
    </>
  )
}

export default HomePage
