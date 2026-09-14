'use client'

import SenalWordmark from '@/assets/icons/SenalWordmark'

/**
 * The route-transition splash.
 *
 * Senal Group is the parent, not one of the operating companies, so the loader
 * shows the bare "senal" wordmark — no "sky", no "site" lockup. The shine sweep
 * is the same one the sibling sites use, and it is switched off under
 * prefers-reduced-motion by the rule in globals.scss.
 */
const LoadingPage = () => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal"
    role="status"
    aria-live="polite"
  >
    <span className="sr-only">Loading</span>
    <div className="relative overflow-hidden">
      <SenalWordmark className="h-[52px] w-[220px] text-white md:h-[64px] md:w-[272px]" />

      {/* Shine sweep */}
      <div className="pointer-events-none absolute inset-0 -skew-x-12" aria-hidden="true">
        <div className="h-full w-full animate-shine bg-gradient-to-r from-transparent via-goldLight to-transparent" />
      </div>
    </div>
  </div>
)

export default LoadingPage
