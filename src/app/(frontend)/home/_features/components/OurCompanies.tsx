import { ArrowRightIcon } from '@/assets/icons/ArrowRightIcon'
import ImageCheck from '@/lib/components/common/ImageCheck'
import UnderlinedHeader from '@/lib/components/common/UnderlinedHeader'
import type { CompanyView } from '@/lib/types/view.types'
import { cn } from '@/lib/utils/functions/misc.functions'

type Props = {
  companies: CompanyView[]
  heading?: string
}

/**
 * Lays out 1, 2 or 3+ cards without leaving a hole in the grid.
 *
 * One card is centred at a readable width rather than stretched across the
 * page; two share a row; three or more wrap at three per row.
 */
const gridClassFor = (count: number) => {
  if (count <= 1) return 'grid-cols-1 max-w-md'
  if (count === 2) return 'grid-cols-1 md:grid-cols-2 max-w-4xl'
  return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl'
}

/**
 * Server component, driven by the Companies collection.
 *
 * It used to be two cards hardcoded in JSX — "Real Estate" and
 * "Travel & Tourism". There are three companies now, and the CEO's message
 * further down the page names all three, so the section was contradicting the
 * page it sits on. Adding a fourth is now an entry in the CMS, not a deploy.
 */
export const OurCompanies = ({ companies, heading = 'Our Companies' }: Props) => {
  if (companies.length === 0) return null

  return (
    <section id="companies" className="w-full scroll-mt-24 bg-grey3 py-20 md:py-28">
      <div className="mx-auto flex w-[86%] max-w-6xl flex-col items-center gap-12 lg:w-4/5">
        <UnderlinedHeader text={heading} className="items-center text-center" />

        <ul
          className={cn(
            'mx-auto grid w-full list-none items-stretch gap-8',
            gridClassFor(companies.length),
          )}
        >
          {companies.map((company) => (
            <li key={company.slug} className="h-full">
              <CompanyCard company={company} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const CompanyCard = ({ company }: { company: CompanyView }) => (
  <article className="flex h-full flex-col overflow-hidden rounded-[14px] border border-grey2 bg-white">
    <CompanyMedia company={company} />

    <div className="flex flex-1 flex-col gap-4 p-7">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold text-charcoal">{company.name}</h3>
        {company.tagline ? <p className="text-sm text-charcoalLight">{company.tagline}</p> : null}
      </div>

      <p className="flex-1 text-base leading-relaxed text-charcoal">{company.description}</p>

      {company.sector ? (
        <div className="flex flex-row items-center gap-3 border-t border-grey3 pt-4">
          <span className="h-4 w-1 rounded-full bg-gold" aria-hidden="true" />
          <span className="text-base font-semibold text-charcoal">{company.sector}</span>
        </div>
      ) : null}

      {company.externalUrl ? (
        <a
          href={company.externalUrl}
          rel="noopener"
          className="mt-1 flex w-full flex-row items-center justify-center gap-2 rounded-lg bg-charcoal px-6 py-2.5 text-base font-semibold text-white transition-colors duration-200 hover:bg-charcoalLight hover:text-gold"
        >
          <span>Visit {company.name}</span>
          <ArrowRightIcon />
        </a>
      ) : (
        /* No site yet. A dead "Explore More" button would be worse than none —
           this states the position instead, and is not focusable. */
        <p className="mt-1 flex w-full flex-row items-center justify-center gap-2 rounded-lg border border-dashed border-gold/60 bg-goldLighter px-6 py-2.5 text-base font-semibold text-charcoal">
          Website coming soon
        </p>
      )}
    </div>
  </article>
)

/**
 * The photo at the top of a card, or a branded panel when the company has no
 * image yet — never a grey rectangle where a picture should be.
 */
const CompanyMedia = ({ company }: { company: CompanyView }) => {
  if (company.image) {
    return (
      <ImageCheck
        image={company.image}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="h-[220px] w-full object-cover md:h-[260px]"
      />
    )
  }

  return (
    <div
      className="flex h-[220px] w-full flex-col items-center justify-center gap-3 bg-charcoal md:h-[260px]"
      aria-hidden="true"
    >
      <span className="text-3xl font-bold tracking-[0.2em] text-gold">
        {company.name
          .split(' ')
          .map((word) => word[0])
          .join('')
          .slice(0, 3)
          .toUpperCase()}
      </span>
      {company.sector ? (
        <span className="text-xs uppercase tracking-[0.22em] text-grey2">{company.sector}</span>
      ) : null}
    </div>
  )
}

export default OurCompanies
