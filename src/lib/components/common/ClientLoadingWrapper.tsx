'use client'

import type { PropsWithChildren } from 'react'
import LoadingPage from './LoadingPage'
import { useNavigation } from '@/lib/providers/NavigationProvider'

export default function ClientLoadingWrapper({ children }: PropsWithChildren) {
  const { isNavigating } = useNavigation()

  /**
   * The splash is layered over the page rather than replacing it. Swapping the
   * tree out — which is what the version this was ported from did — unmounts
   * the current route mid-navigation and throws away its scroll position.
   */
  return (
    <>
      {children}
      {isNavigating ? <LoadingPage /> : null}
    </>
  )
}
