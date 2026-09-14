import type { CSSProperties, DetailedHTMLProps, InputHTMLAttributes } from 'react'

type ReactInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

export type BaseInput<O extends keyof ReactInputProps = never> = Omit<
  ReactInputProps,
  O | 'type'
> & {
  label: string
  hideLabel?: boolean
}

export type IconProps = {
  size?: CSSProperties['width']
  fill?: CSSProperties['fill']
  stroke?: CSSProperties['stroke']
  className?: string
}
