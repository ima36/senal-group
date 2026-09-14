'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'

type NavigationContextType = {
  isNavigating: boolean
  navigateWithLoading: (href: string) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

/** "/#about" -> "/", "/terms" -> "/terms". usePathname never includes the hash. */
export const pathnameOf = (href: string): string => href.split('#')[0] || '/'

export function NavigationProvider({ children }: PropsWithChildren) {
  const [pendingPath, setPendingPath] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const navigateWithLoading = useCallback(
    (href: string) => {
      const target = pathnameOf(href)

      // Same page, different anchor: no route change, so no splash. Comparing
      // the raw href here instead would leave the overlay up forever, because
      // usePathname strips the hash and would never match "/#about".
      if (target === pathname) {
        router.push(href)
        return
      }

      setPendingPath(target)
      router.push(href)
    },
    [router, pathname],
  )

  // Clear it once the new route is actually mounted.
  useEffect(() => {
    if (pendingPath && pathname === pendingPath) setPendingPath(null)
  }, [pathname, pendingPath])

  // Safety net: a navigation that never resolves (a hard failure, a blocked
  // route) must not strand the visitor behind a full-screen overlay.
  useEffect(() => {
    if (!pendingPath) return
    const timer = setTimeout(() => setPendingPath(null), 8000)
    return () => clearTimeout(timer)
  }, [pendingPath])

  return (
    <NavigationContext.Provider
      value={{ isNavigating: pendingPath !== null, navigateWithLoading }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
