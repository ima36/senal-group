import {
  forwardRef,
  type ButtonHTMLAttributes,
  type DetailedHTMLProps,
  type PropsWithChildren,
} from 'react'
import { cn } from '@/lib/utils/functions/misc.functions'

type Props = Omit<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  'ref'
> & {
  /**
   * solid   — gold on charcoal, the primary action
   * outline — charcoal rule on a light ground
   * light   — white fill for use over the hero photo
   */
  variant?: 'solid' | 'outline' | 'light'
  px?: string
  fontSize?: string
  minHeight?: string
  /**
   * Render as a <span> instead of a <button>.
   *
   * Cards wrap their whole body in a link, and a <button> inside an <a> is
   * invalid HTML — browsers reparent it, and screen readers announce two
   * separate controls for one target. `as="span"` keeps the look without the
   * nested interactive element.
   */
  as?: 'button' | 'span'
}

const VARIANTS = {
  // gold text on charcoal is 6.5:1 — safe at any size
  solid: 'bg-charcoal text-white hover:bg-charcoalLight hover:text-gold',
  outline: 'bg-transparent text-charcoal border border-charcoal hover:bg-charcoal hover:text-white',
  light: 'bg-white text-charcoal hover:bg-goldLighter',
} as const

export const buttonClasses = ({
  px,
  minHeight,
  fontSize,
  variant = 'solid',
  className,
}: Partial<Props>) =>
  cn(
    'flex w-fit cursor-pointer items-center justify-center gap-2 text-nowrap rounded-lg font-semibold',
    'py-2 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50',
    px ?? 'lg:px-8 px-6',
    minHeight ?? 'min-h-[2.5rem]',
    fontSize ?? 'lg:text-lg',
    VARIANTS[variant],
    className,
  )

const Button = forwardRef<HTMLButtonElement, PropsWithChildren<Props>>(
  ({ className, children, disabled, variant, px, fontSize, minHeight, as = 'button', ...rest }, ref) => {
    const classes = buttonClasses({ px, minHeight, fontSize, variant, className })

    if (as === 'span') {
      return <span className={classes}>{children}</span>
    }

    return (
      <button ref={ref} {...rest} className={classes} disabled={disabled}>
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'

export default Button
