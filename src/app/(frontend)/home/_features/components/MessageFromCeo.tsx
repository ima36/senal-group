import { QuotationIcon } from '@/assets/icons/QuotationIcon'
import ImageCheck from '@/lib/components/common/ImageCheck'
import PersonPlaceholder from '@/lib/components/common/PersonPlaceholder'
import UnderlinedHeader from '@/lib/components/common/UnderlinedHeader'
import type { CeoContent } from '@/lib/types/view.types'

type Props = {
  ceo: CeoContent
}

/**
 * Server component.
 *
 * Two changes from the version this was ported from: the lorem ipsum is gone,
 * replaced with the message the client actually wrote; and `/images/ceo.png` —
 * a stock photograph of somebody who is not the CEO — is gone too. When
 * `ceoPhoto` is empty the page draws PersonPlaceholder instead, which is a
 * designed mark rather than a missing image.
 */
export const MessageFromCeo = ({ ceo }: Props) => (
  <section className="w-full py-20 md:py-28">
    <div className="mx-auto flex w-[86%] max-w-6xl flex-col items-center gap-10 md:flex-row md:items-start md:gap-16 lg:w-4/5">
      <div className="w-2/3 shrink-0 sm:w-1/2 md:w-1/3">
        {ceo.photo ? (
          <ImageCheck
            image={ceo.photo}
            sizes="(max-width: 768px) 60vw, 30vw"
            className="aspect-square w-full rounded-[20px] object-cover"
          />
        ) : (
          <PersonPlaceholder className="aspect-square w-full rounded-[20px]" />
        )}
      </div>

      <div className="flex w-full flex-col gap-8 md:w-2/3 md:gap-10">
        <UnderlinedHeader text={ceo.heading} className="max-w-[22rem]" />

        {/* figure + figcaption, so the attribution sits outside the quotation
            itself — the spec is explicit that a name is not part of the quote. */}
        <figure className="m-0 flex flex-col gap-5">
          <QuotationIcon className="h-8 w-auto text-goldLight" />

          <blockquote className="m-0 flex flex-col gap-4">
            {ceo.message.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-charcoal md:text-lg">
                {paragraph}
              </p>
            ))}
          </blockquote>

          <figcaption className="flex flex-col">
            <span className="text-base font-bold text-charcoal">{ceo.name}</span>
            <span className="text-sm font-medium text-charcoalLight">{ceo.title}</span>
            <span className="text-sm font-medium text-charcoalLight">{ceo.org}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
)

export default MessageFromCeo
