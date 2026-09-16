'use client'
import React from 'react'
import Link from 'next/link'
import Flexbox from '../ui/Flexbox'
import SenalWordmark from '@/assets/icons/SenalWordmark'
import { FooterLinks } from './FooterLinks'

/**
 * Restored to the pre-split original's structure.
 *
 * The previous version here was a redesign — a flex column layout with a
 * wordmark, a tagline and a "coming soon" company nav — none of which existed
 * before the split. This is the original again: the
 * `max-w-6xl mx-auto grid-cols-5 items-center gap-[50px]` desktop row with the
 * mark centred between the cross-site links and the legal links, the separate
 * `md:hidden px-9` mobile row, and the same `md:py-8 py-4` band over a
 * copyright strip at `text-[10px] md:text-[14px]`.
 *
 * Differences, all forced and none structural:
 *
 *  - The band is `bg-charcoal` over `bg-greyBg`. The original used `bg-black`
 *    over `bg-greyBg` for the Senal Group path; charcoal is the palette that
 *    was actually chosen for this company.
 *  - The centre mark is Senal Group's own wordmark. The original reached for
 *    Senal Sky's `LogoIcon`, which does not belong to this project.
 *  - Terms and Privacy pointed at `/home`, which was never a route — two 404s
 *    in the footer of every page. They point at the real pages.
 */
export const Footer = () => {
  return (
    <Flexbox fullWidth>
      <div className="w-full md:py-8 py-4 bg-charcoal">
        <div className="max-w-6xl mx-auto grid-cols-5 items-center gap-[50px] hidden md:grid">
          {/* Left and right links (dynamic) */}
          <FooterLinks />
          {/* Center logo */}
          <div className="justify-self-center">
            <SenalWordmark className="h-7 w-[119px] text-white" />
          </div>
          {/* Right side links */}
          <Link
            href="/terms"
            className="text-white text-[18px] font-medium hover:opacity-75 transition-opacity duration-300 justify-self-start"
          >
            Terms &amp; Conditions
          </Link>
          <Link
            href="/privacy"
            className="text-white text-[18px] font-medium hover:opacity-75 transition-opacity duration-300 justify-self-start"
          >
            Privacy Policy
          </Link>
        </div>
        <Flexbox align="center" row fullWidth justify="between" className="mx-auto md:hidden px-9">
          <div className="w-1/5">
            <SenalWordmark className="h-6 w-[96px] text-white" />
          </div>
          <Flexbox row fullWidth justify="around" align="center" className="w-3/4">
            <Flexbox className="gap-3">
              <FooterLinks />
            </Flexbox>

            <Flexbox className="gap-3">
              <Link
                href="/terms"
                className="text-white whitespace-nowrap text-xs font-medium hover:opacity-75 transition-opacity duration-300 justify-self-start"
              >
                Terms &amp; Conditions
              </Link>
              <Link
                href="/privacy"
                className="text-white whitespace-nowrap text-xs font-medium hover:opacity-75 transition-opacity duration-300 justify-self-start"
              >
                Privacy Policy
              </Link>
            </Flexbox>
          </Flexbox>
        </Flexbox>
      </div>
      <Flexbox
        row
        fullWidth
        justify="center"
        align="center"
        className="md:py-8 py-4 text-[10px] md:text-[14px] bg-greyBg"
      >
        Senal Group © {new Date().getFullYear()} | All Rights Reserved.
      </Flexbox>
    </Flexbox>
  )
}

export default Footer
