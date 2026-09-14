import type { ComponentProps } from 'react'

export const DartBoardIcon = ({ ...svgProps }: ComponentProps<'svg'>) => (
  <svg
    width="51"
    height="48"
    viewBox="0 0 51 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...svgProps}
  >
    <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 46C33.0457 46 42 37.0457 42 26C42 14.9543 33.0457 6 22 6C10.9543 6 2 14.9543 2 26C2 37.0457 10.9543 46 22 46Z" />
      <path d="M22 38C28.6274 38 34 32.6274 34 26C34 19.3726 28.6274 14 22 14C15.3726 14 10 19.3726 10 26C10 32.6274 15.3726 38 22 38Z" />
      <path d="M22 30C24.2091 30 26 28.2091 26 26C26 23.7909 24.2091 22 22 22C19.7909 22 18 23.7909 18 26C18 28.2091 19.7909 30 22 30Z" />
      <path d="M44 7L26 23" />
      <path d="M45 2L44 6" />
      <path d="M44 7H49" />
    </g>
  </svg>
)
