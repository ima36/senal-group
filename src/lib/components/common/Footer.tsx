import SenalWordmark from '@/assets/icons/SenalWordmark'
import NavigationLink from './NavigationLink'
import { getAvailableLegalPages } from '@/lib/api/legal.actions'
import { SENAL_SITE_URL, SENAL_SKY_URL } from '@/lib/site.config'

/**
 * The three companies live on three domains, so the sibling links are absolute
 * and marked rel="noopener". Internal pages still use NavigationLink so they
 * keep the loading transition.
 */
const SIBLING_SITES = [
  { href: SENAL_SKY_URL, label: 'Senal Sky' },
  { href: SENAL_SITE_URL, label: 'Senal Site' },
] as const

const LEGAL_LABELS = {
  terms: { href: '/terms', label: 'Terms & Conditions' },
  privacy: { href: '/privacy', label: 'Privacy Policy' },
} as const

/**
 * Server component. Legal links are rendered only for documents that actually
 * have content — the version this was ported from linked both of them at
 * `/home`, a route that does not exist, so every page footer carried two 404s.
 */
export const Footer = async () => {
  const available = await getAvailableLegalPages()
  const legalLinks = available.map((key) => LEGAL_LABELS[key])

  return (
    <footer className="w-full">
      <div className="w-full bg-charcoal py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col items-center gap-3 md:items-start">
            <NavigationLink href="/" aria-label="Senal Group — home">
              <SenalWordmark className="h-7 w-[119px] text-white" />
            </NavigationLink>
            <p className="text-sm text-grey2">Three companies. Three industries. One vision.</p>
          </div>

          <nav aria-label="Group companies" className="flex flex-col items-center gap-3 md:items-start">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              Group companies
            </h2>
            <ul className="flex list-none flex-col items-center gap-2 md:items-start">
              {SIBLING_SITES.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    rel="noopener"
                    className="text-base font-medium text-white transition-opacity duration-300 hover:opacity-75"
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <span className="text-base font-medium text-grey2">
                  Senal Sea <span className="text-sm text-gold">— coming soon</span>
                </span>
              </li>
            </ul>
          </nav>

          {legalLinks.length > 0 ? (
            <nav aria-label="Legal" className="flex flex-col items-center gap-3 md:items-start">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Legal</h2>
              <ul className="flex list-none flex-col items-center gap-2 md:items-start">
                {legalLinks.map(({ href, label }) => (
                  <li key={href}>
                    <NavigationLink
                      href={href}
                      className="text-base font-medium text-white transition-opacity duration-300 hover:opacity-75"
                    >
                      {label}
                    </NavigationLink>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </div>

      <div className="flex w-full flex-row items-center justify-center bg-ink py-5 text-center text-xs text-grey2 md:text-sm">
        Senal Group © {new Date().getFullYear()} | All Rights Reserved.
      </div>
    </footer>
  )
}

export default Footer
