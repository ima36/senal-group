import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { IconProps } from '@/lib/types/components.types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function defaultIconProps(props: IconProps) {
  return {
    size: '16',
    fill: 'currentColor',
    stroke: 'currentColor',
    ...props,
  }
}
