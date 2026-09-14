import { notFound } from 'next/navigation'

/**
 * Catches every URL that matches no other route and hands it to
 * `(frontend)/not-found.tsx`, so a mistyped address gets the site's own 404 —
 * header, footer and a way back — instead of Next's bare built-in page.
 *
 * A root-level `app/not-found.tsx` would be the obvious way to do this, but it
 * is rejected at build time here: this project has no root layout (the
 * (frontend) and (payload) groups each provide their own <html>), and Next
 * refuses a root not-found without one. Real routes beat a catch-all on
 * specificity, so /admin, /api/*, /terms and /privacy are unaffected.
 */
export default function CatchAllNotFound(): never {
  notFound()
}
