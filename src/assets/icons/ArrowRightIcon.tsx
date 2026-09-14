import type { ComponentProps } from 'react'

export const ArrowRightIcon = ({ ...svgProps }: ComponentProps<'svg'>) => (
  <svg
    width="18"
    height="14"
    viewBox="0 0 18 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...svgProps}
  >
    <path
      d="M1 7H16M16 7L10.5 1.5M16 7L10.5 12.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
