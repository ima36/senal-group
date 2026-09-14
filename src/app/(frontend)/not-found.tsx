import type { Metadata } from 'next'

import NavigationLink from '@/lib/components/common/NavigationLink'
import Button from '@/lib/components/ui/Button'
import GeneralLayout from '@/lib/components/ui/Layout/GeneralLayout'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <GeneralLayout>
      <main
        id="main"
        className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-6 px-6 pt-32 text-center"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gold">Error 404</p>
        <h1 className="text-3xl font-bold text-charcoal md:text-4xl">
          We couldn&apos;t find that page
        </h1>
        <p className="max-w-md text-base text-charcoal">
          It may have moved, or the address may be slightly off.
        </p>
        <NavigationLink href="/">
          <Button as="span">Back to home</Button>
        </NavigationLink>
      </main>
    </GeneralLayout>
  )
}
