'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import SenalWordmark from '@/assets/icons/SenalWordmark'
import { CloseIcon } from '@/assets/icons/CloseIcon'
import { MenuIcon } from '@/assets/icons/MenuIcon'
import NavigationLink from './NavigationLink'
import Button from '@/lib/components/ui/Button'
import { useContact } from '@/lib/providers/ContactProvider'
import { SENAL_SITE_URL, SENAL_SKY_URL } from '@/lib/site.config'
import { whatsappLink } from '@/lib/utils/functions/helper.functions'
import { cn } from '@/lib/utils/functions/misc.functions'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Our Companies', href: '/#companies' },
  { label: 'Contact', href: '/#contact' },
] as const

const SIBLING_SITES = [
  { href: SENAL_SKY_URL, label: 'Senal Sky' },
  { href: SENAL_SITE_URL, label: 'Senal Site' },
] as const

export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const contact = useContact()
  const whatsapp = whatsappLink(contact.phoneNumber1, contact.phoneNumber2)

  const closeDrawer = () => setIsDrawerOpen(false)

  /** Only a real route can be the "current page"; the hash links are jumps within it. */
  const isCurrentPage = (href: string) => href === '/' && pathname === '/'

  /**
   * The bar is transparent only where there is a dark hero photograph behind
   * it, which is the home page and nowhere else. On /terms and /privacy the
   * page behind it is white, and white-on-white would make the whole nav
   * invisible until the first scroll.
   */
  const isOverHero = pathname === '/'
  const isSolid = isScrolled || !isOverHero

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    if (!isDrawerOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isDrawerOpen])

  // Escape closes the drawer, and focus goes back to the button that opened it.
  useEffect(() => {
    if (!isDrawerOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      closeDrawer()
      menuButtonRef.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isDrawerOpen])

  // Move focus into the dialog when it opens, so the next Tab lands on a link
  // inside it rather than continuing through the page behind it.
  useEffect(() => {
    if (isDrawerOpen) closeButtonRef.current?.focus()
  }, [isDrawerOpen])

  // Close it when the route changes underneath it.
  useEffect(() => {
    setIsDrawerOpen(false)
  }, [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-colors duration-300',
          isSolid ? 'bg-charcoal/95 shadow-header backdrop-blur-sm' : 'bg-transparent',
        )}
      >
        <nav
          aria-label="Main"
          className="mx-auto flex w-full max-w-6xl flex-row items-center justify-between gap-4 px-6 py-4 md:px-8"
        >
          <NavigationLink href="/" aria-label="Senal Group — home" className="shrink-0">
            <SenalWordmark className="h-6 w-[102px] text-white md:h-7 md:w-[119px]" />
          </NavigationLink>

          {/* Desktop links */}
          <ul className="hidden list-none items-center gap-7 md:flex 2xl:gap-9">
            {NAV_LINKS.map(({ label, href }) => {
              const current = isCurrentPage(href)
              return (
                <li key={href}>
                  <NavigationLink
                    href={href}
                    aria-current={current ? 'page' : undefined}
                    className={cn(
                      'group relative text-base font-medium text-white transition-opacity duration-300 hover:opacity-80 2xl:text-lg',
                    )}
                  >
                    {label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute left-0 right-0 top-full mt-1.5 h-0.5 origin-left rounded-pill bg-gold transition-transform duration-300 ease-out',
                        current ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                      )}
                    />
                  </NavigationLink>
                </li>
              )
            })}
            {whatsapp ? (
              <li>
                <Link href={whatsapp} target="_blank" rel="noopener noreferrer">
                  <Button as="span" variant="light" fontSize="text-base" minHeight="min-h-[2.25rem]">
                    Contact Us
                  </Button>
                </Link>
              </li>
            ) : null}
          </ul>

          {/* Mobile menu button */}
          <button
            ref={menuButtonRef}
            type="button"
            className="text-white md:hidden"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open menu"
            aria-expanded={isDrawerOpen}
            aria-controls="mobile-menu"
          >
            <MenuIcon />
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      {isDrawerOpen ? (
        <div className="fixed inset-0 z-50 md:hidden" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
          {/* Click-away scrim. Deliberately a div, not a button: a second
              control labelled "Close menu" would read as a duplicate to a
              screen reader, and Escape plus the real close button already
              cover the keyboard. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 h-full w-full bg-ink/70 backdrop-blur-sm"
            onClick={closeDrawer}
          />
          <div className="absolute right-0 top-0 h-full w-full bg-charcoal">
            <div className="flex items-center justify-between border-b border-gold/25 p-6">
              <SenalWordmark className="h-6 w-[102px] text-white" />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeDrawer}
                aria-label="Close menu"
                className="rounded-full p-2 text-white transition-colors duration-200 hover:bg-goldLighter"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="px-8 py-10">
              <ul className="flex list-none flex-col gap-2">
                {NAV_LINKS.map(({ label, href }) => {
                  const current = isCurrentPage(href)
                  return (
                    <li key={href}>
                      <NavigationLink
                        href={href}
                        aria-current={current ? 'page' : undefined}
                        onClick={closeDrawer}
                        className={cn(
                          'flex items-center justify-between rounded-xl border border-transparent px-4 py-4 text-xl font-medium transition-colors duration-300',
                          current ? 'border-gold/40 bg-goldLighter text-gold' : 'text-white hover:bg-white/5',
                        )}
                      >
                        <span>{label}</span>
                      </NavigationLink>
                    </li>
                  )
                })}
              </ul>

              <p className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                Our companies
              </p>
              <ul className="mt-4 flex list-none flex-col gap-3">
                {SIBLING_SITES.map(({ href, label }) => (
                  <li key={href}>
                    <a
                      href={href}
                      rel="noopener"
                      onClick={closeDrawer}
                      className="text-lg font-medium text-white transition-opacity duration-300 hover:opacity-75"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>

              {whatsapp ? (
                <Link
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeDrawer}
                  className="mt-10 block"
                >
                  <Button as="span" variant="light" className="w-full">
                    Contact Us
                  </Button>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Header
