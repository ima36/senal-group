import Flexbox from '../ui/Flexbox'
import { cn } from '@/lib/utils/functions/misc.functions'

type Props = {
  text: string
  /** Anchor target, so the hero CTA can scroll to the section this heads. */
  id?: string
  className?: string
  /** The rule under the heading. Gold on light, white on dark. */
  ruleClassName?: string
  textClassName?: string
  /**
   * Heading level. Sections use h2; nothing on this site needs an h3 header
   * with a rule, but the prop keeps the level honest if that changes.
   */
  as?: 'h2' | 'h3'
}

/**
 * Section heading with the brand rule beneath it.
 *
 * The rule is gold; the words are charcoal. Gold is ~3.1:1 on white, which is
 * fine for a 4px bar and wrong for text, so the two are never swapped.
 */
export const UnderlinedHeader = ({
  text,
  id,
  className,
  ruleClassName,
  textClassName,
  as: Tag = 'h2',
}: Props) => (
  <Flexbox className={cn('gap-2', className)}>
    <Tag
      id={id}
      className={cn('text-2xl font-bold md:text-3xl 2xl:text-4xl', textClassName ?? 'text-charcoal')}
    >
      {text}
    </Tag>
    <div className={cn('h-1 w-full rounded-full', ruleClassName ?? 'bg-gold')} />
  </Flexbox>
)

export default UnderlinedHeader
