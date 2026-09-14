import type { ComponentProps } from 'react'

export const MenuIcon = ({ ...svgProps }: ComponentProps<'svg'>) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...svgProps}
  >
    <path
      d="M4 16H28M4 8H28M4 24H28"
      stroke="currentColor"
      strokeWidth="2.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
