import Image from 'next/image'
import type { ImageView } from '@/lib/types/view.types'

type Props = {
  image?: ImageView | null
  /** Escape hatch for the handful of static images left in /public. */
  src?: string
  alt?: string
  className?: string
  /** Only the LCP image on a page should set this. */
  priority?: boolean
  /** Tells the optimiser which width to actually serve. */
  sizes?: string
  width?: number
  height?: number
  quality?: number
}

/**
 * Renders a CMS image, or a neutral placeholder when there isn't one.
 *
 * `priority` is opt-in. Setting it on every image — as the version this was
 * ported from did — disables lazy loading site-wide and makes the browser fetch
 * every below-the-fold photo at once. Exactly one image per page gets it.
 */
const ImageCheck = ({
  image,
  src,
  alt,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw',
  width,
  height,
  quality = 82,
}: Props) => {
  const resolvedSrc = image?.url ?? src
  const resolvedAlt = image?.alt ?? alt ?? ''

  if (!resolvedSrc) {
    return <div className={`bg-grey3 ${className ?? 'h-40 w-full'}`} aria-hidden="true" />
  }

  return (
    <Image
      src={resolvedSrc}
      alt={resolvedAlt}
      width={width ?? image?.width ?? 1200}
      height={height ?? image?.height ?? 800}
      className={className}
      quality={quality}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
    />
  )
}

export default ImageCheck
