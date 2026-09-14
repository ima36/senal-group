'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { MouseEvent, ReactNode } from 'react'
import { pathnameOf, useNavigation } from '@/lib/providers/NavigationProvider'

type Props = {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
  'aria-label'?: string
  'aria-current'?: 'page' | undefined
}

/**
 * An internal link that shows the loading wordmark while the next route mounts.
 *
 * Two things it does that the version this was ported from did not:
 *
 *  - it wraps next/link and bails out of the loading behaviour for modified
 *    clicks. The old one called preventDefault() unconditionally, which broke
 *    ⌘-click, middle-click and "Open in new tab" on every internal link.
 *  - it leaves same-page anchors (/#about while already on /) entirely alone,
 *    so the browser performs the jump natively.
 */
export default function NavigationLink({ href, children, className, onClick, ...aria }: Props) {
  const { navigateWithLoading } = useNavigation()
  const pathname = usePathname()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.()

    // Let the browser handle new-tab / new-window / download intents.
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return
    }

    // A hash on the page we are already on: native scroll, no router, no splash.
    if (href.includes('#') && pathnameOf(href) === pathname) return

    event.preventDefault()
    navigateWithLoading(href)
  }

  return (
    <Link href={href} className={className} onClick={handleClick} {...aria}>
      {children}
    </Link>
  )
}
