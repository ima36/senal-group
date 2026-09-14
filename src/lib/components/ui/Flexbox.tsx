import type { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '@/lib/utils/functions/misc.functions'

export type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  row?: boolean
  reverse?: boolean
  fullWidth?: boolean
  fullHeight?: boolean
  fullFlex?: boolean
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
}

const JUSTIFY_CLASS_MAP = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
} as const

const ALIGN_CLASS_MAP = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
} as const

const Flexbox = ({
  row,
  reverse,
  fullWidth,
  fullHeight,
  fullFlex,
  justify = 'start',
  align = 'start',
  className,
  children,
  ...divProps
}: PropsWithChildren<Props>) => (
  <div
    className={cn(
      'flex',
      row ? (reverse ? 'flex-row-reverse' : 'flex-row') : reverse ? 'flex-col-reverse' : 'flex-col',
      fullWidth && 'w-full',
      fullHeight && 'h-full',
      fullFlex && 'flex-1',
      JUSTIFY_CLASS_MAP[justify],
      ALIGN_CLASS_MAP[align],
      className,
    )}
    {...divProps}
  >
    {children}
  </div>
)

export default Flexbox
