import NavigationLink from './NavigationLink'
import { SENAL_SITE_URL, SENAL_SKY_URL } from '@/lib/site.config'

/**
 * Restored from the pre-split original, character for character in the classes,
 * with the Senal Group branch's link pair (Senal Sky + Senal Site).
 *
 * One necessary change: the original linked to `/` and `/senal-site` as in-app
 * routes. Those are separate deployments on their own domains now, so the
 * hrefs are absolute. Same element, same classes, same `pr-[50px]` on the
 * second link that lines the grid up.
 */
export function FooterLinks() {
  const links: { href: string; label: string }[] = [
    { href: SENAL_SKY_URL, label: 'Senal Sky' },
    { href: SENAL_SITE_URL, label: 'Senal Site' },
  ]

  return (
    <>
      {links.map((link, i) => (
        <NavigationLink
          key={link.href}
          href={link.href}
          className={`text-white text-xs md:text-[18px] font-medium hover:opacity-75 transition-opacity duration-300 justify-self-end${i === 1 ? ' pr-[50px]' : ''}`}
        >
          {link.label}
        </NavigationLink>
      ))}
    </>
  )
}
