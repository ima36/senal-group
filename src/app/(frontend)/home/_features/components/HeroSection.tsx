import SenalWordmark from '@/assets/icons/SenalWordmark'
import { MouseIcon } from '@/assets/icons/MouseIcon'
import Button from '@/lib/components/ui/Button'
import HeroMedia from './HeroMedia'
import type { HeroContent } from '@/lib/types/view.types'

type Props = {
  hero: HeroContent
  /** Null when no phone number is configured — the CTA is then dropped. */
  whatsappHref: string | null
}

/**
 * Server component. Only the photograph is a client island (it needs an
 * IntersectionObserver), so the headline, the tagline and both calls to action
 * are in the HTML a crawler receives.
 *
 * Heading order: this <h1> is the only one on the page. The version this was
 * ported from used <h1> for the tagline here and again further down the page.
 */
export const HeroSection = ({ hero, whatsappHref }: Props) => (
  <section className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden">
    <HeroMedia image={hero.image} />

    <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-10 px-6 py-28 text-center">
      <div className="flex flex-col items-center gap-5">
        {/* The wordmark is the visual h1. It carries the heading as real text
            in a visually-hidden span rather than only as an SVG aria-label, so
            the <h1> a crawler reads is not empty — and the SVG stays
            aria-hidden, so nothing is announced twice. */}
        <h1 className="flex flex-col items-center gap-4">
          <SenalWordmark className="h-11 w-[187px] text-white sm:h-14 sm:w-[238px]" />
          <span className="sr-only">{hero.heading}</span>
        </h1>
        {hero.tagline ? (
          <p className="text-lg font-medium text-white md:text-xl">{hero.tagline}</p>
        ) : null}
      </div>

      <div className="flex w-full flex-row flex-wrap items-center justify-center gap-4">
        {/* A plain anchor: it scrolls without JavaScript and is a real link in
            the accessibility tree, unlike the onClick-only button it replaces. */}
        <a href="#companies">
          <Button as="span" variant="light">
            {hero.ctaLabel}
          </Button>
        </a>
        {whatsappHref ? (
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <Button as="span" variant="light">
              Contact Us
            </Button>
          </a>
        ) : (
          <a href="#contact">
            <Button as="span" variant="light">
              Contact Us
            </Button>
          </a>
        )}
      </div>
    </div>

    <a
      href="#about"
      className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 text-white"
      aria-label="Scroll to About Senal"
    >
      <span className="text-xs uppercase tracking-[0.2em]" aria-hidden="true">
        Scroll
      </span>
      <MouseIcon className="scroll-cue" />
    </a>
  </section>
)

export default HeroSection
