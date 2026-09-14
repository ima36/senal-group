import type { ReactNode } from 'react'

import { DartBoardIcon } from '@/assets/icons/DartBoardIcon'
import { EyeIcon } from '@/assets/icons/EyeIcon'
import ImageCheck from '@/lib/components/common/ImageCheck'
import UnderlinedHeader from '@/lib/components/common/UnderlinedHeader'
import Flexbox from '@/lib/components/ui/Flexbox'
import { FALLBACK_ABOUT_IMAGES } from '@/lib/content/images'
import type { AboutContent } from '@/lib/types/view.types'
import { cn } from '@/lib/utils/functions/misc.functions'

type Props = {
  about: AboutContent
}

/** Heights for the staggered collage; anything past the fourth image is even. */
const COLLAGE_HEIGHTS = ['h-56', 'h-40 mt-16', 'h-auto', 'h-56'] as const

/**
 * Server component — the copy is in the HTML, which is the point for search.
 */
export const AboutSenal = ({ about }: Props) => {
  const images = about.images.length > 0 ? about.images : FALLBACK_ABOUT_IMAGES

  return (
    <section id="about" className="w-full scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto flex w-[86%] max-w-6xl flex-col gap-16 md:gap-20 lg:w-4/5">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:gap-14">
          <div className="flex w-full flex-col md:w-1/2">
            <UnderlinedHeader text={about.heading} className="mb-8 max-w-[16rem]" />
            <div className="flex flex-col gap-4">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-base leading-relaxed text-charcoal md:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="w-full md:w-5/12">
            <div className="grid w-full grid-cols-2 gap-5">
              {images.slice(0, 4).map((image, index) => (
                <ImageCheck
                  key={image.url}
                  image={image}
                  sizes="(max-width: 768px) 45vw, 20vw"
                  className={cn(
                    'w-full rounded-xl object-cover',
                    COLLAGE_HEIGHTS[index] ?? 'h-48',
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-6 md:flex-row md:gap-8">
          <AboutCard
            icon={<DartBoardIcon className="h-10 w-auto text-gold" />}
            title={about.mission.heading}
            description={about.mission.text}
          />
          <AboutCard
            icon={<EyeIcon className="h-10 w-auto text-gold" />}
            title={about.vision.heading}
            description={about.vision.text}
          />
        </div>
      </div>
    </section>
  )
}

type CardProps = {
  icon: ReactNode
  title: string
  description: string
}

const AboutCard = ({ icon, title, description }: CardProps) => (
  <Flexbox
    justify="start"
    align="center"
    className="flex-1 gap-5 rounded-[20px] border border-grey3 bg-greyBg p-8"
  >
    <div className="flex h-12 items-center justify-center">{icon}</div>
    {/* h3 — the section's own h2 is "About Senal" and levels must not skip. */}
    <h3 className="text-xl font-bold text-charcoal md:text-[22px]">{title}</h3>
    <p className="text-center text-base text-charcoal md:text-[17px]">{description}</p>
  </Flexbox>
)

export default AboutSenal
