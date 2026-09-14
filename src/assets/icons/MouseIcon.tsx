import type { ComponentProps } from 'react'

export const MouseIcon = ({ ...svgProps }: ComponentProps<'svg'>) => (
  <svg
    width="19"
    height="38"
    viewBox="0 0 19 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...svgProps}
  >
    <rect x="1" y="1" width="17" height="36" rx="8.5" stroke="currentColor" strokeWidth="2" />
    <rect x="8" y="8" width="3" height="8" rx="1.5" fill="currentColor" />
  </svg>
)
