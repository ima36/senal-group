'use client'

import { createContext, useContext, type PropsWithChildren } from 'react'
import type { ContactInfo } from '@/lib/types/view.types'

const EMPTY: ContactInfo = {
  email: '',
  phoneNumber1: '',
  phoneNumber2: '',
  address: '',
  startingOpeningHour: null,
  endingOpeningHour: null,
}

const ContactContext = createContext<ContactInfo>(EMPTY)

/**
 * Contact details are fetched once, server-side, in the frontend layout and
 * handed down through this provider.
 *
 * In the version this page was ported from, the header, the footer and the
 * Get In Touch form each ran their own useQuery for the same global — under
 * three different query keys ("homeData", "home-data", "home") — so React Query
 * treated them as three unrelated resources and every page paid for three round
 * trips. One server fetch, one context.
 */
export const ContactProvider = ({
  value,
  children,
}: PropsWithChildren<{ value: ContactInfo }>) => (
  <ContactContext.Provider value={value}>{children}</ContactContext.Provider>
)

export const useContact = () => useContext(ContactContext)
