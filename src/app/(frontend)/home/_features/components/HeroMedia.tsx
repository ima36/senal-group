'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { HERO_FALLBACK_ALT } from '@/lib/content/images'
import type { ImageView } from '@/lib/types/view.types'

type Props = {
  image: ImageView | null
}

/** Shipped in /public so the page has a hero even before anything is uploaded. */
const FALLBACK_SRC = '/images/senal-group.webp'

/**
 * The hero photograph and its scrim.
 *
 * Three things changed from the version this was ported from:
 *
 *  - it was a CSS `background-image`, which next/image cannot touch: no
 *    responsive sources, no AVIF/WebP negotiation, and no LCP candidate for the
 *    browser to prioritise. It is now a real <Image fill priority>.
 *  - the flat `bg-black opacity-60` wash that greyed the whole photograph out is
 *    replaced by the layered `.hero-scrim` in globals.scss.
 *  - the slow drift is driven by a class, not an always-on animation, and an
 *    IntersectionObserver removes it once the hero leaves the viewport. An
 *    element that animates forever off screen costs compositing work and
 *    battery for something nobody can see.
 *
 * The drift is switched off entirely under prefers-reduced-motion by the media
 * query in globals.scss, so no JavaScript has to know about that preference.
 */
export const HeroMedia = ({ image }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOnScreen, setIsOnScreen] = useState(false)

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setIsOnScreen(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry) setIsOnScreen(entry.isIntersecting)
      },
      { threshold: 0 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <div className="ken-burns absolute inset-0" data-active={isOnScreen}>
        <Image
          src={image?.url ?? FALLBACK_SRC}
          alt={image?.alt || HERO_FALLBACK_ALT}
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover object-center"
        />
      </div>
      <div className="hero-scrim absolute inset-0" aria-hidden="true" />
    </div>
  )
}

export default HeroMedia
