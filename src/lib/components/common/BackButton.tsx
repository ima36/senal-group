'use client'

import { useRouter } from 'next/navigation'
import { ArrowRightIcon } from '@/assets/icons/ArrowRightIcon'
import Flexbox from '@/lib/components/ui/Flexbox'
import { cn } from '@/lib/utils/functions/misc.functions'

type Props = {
  /** Where to go when the user arrived directly, with no history to go back to. */
  fallbackHref: string
  label?: string
  className?: string
}

export const BackButton = ({ fallbackHref, label = 'Back', className }: Props) => {
  const router = useRouter()

  const handleClick = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackHref)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'cursor-pointer border-none bg-transparent text-charcoal transition-opacity duration-300 hover:opacity-75',
        className,
      )}
    >
      <Flexbox row align="center" className="gap-3">
        <ArrowRightIcon className="rotate-180 text-gold" />
        <span className="text-lg font-medium md:text-xl">{label}</span>
      </Flexbox>
    </button>
  )
}

export default BackButton
