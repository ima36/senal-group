import type { PropsWithChildren } from 'react'
import Footer from '../../common/Footer'
import Header from '../../common/Header'

export default function GeneralLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
