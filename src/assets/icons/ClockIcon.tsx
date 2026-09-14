import type { ComponentProps } from 'react'

export const ClockIcon = ({ ...svgProps }: ComponentProps<'svg'>) => (
  <svg
    width="26"
    height="27"
    viewBox="0 0 26 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...svgProps}
  >
    <path
      d="M12.9998 7.00002V13.5L17.3332 15.6667M23.8332 13.5C23.8332 19.4831 18.9829 24.3334 12.9998 24.3334C7.01675 24.3334 2.1665 19.4831 2.1665 13.5C2.1665 7.51694 7.01675 2.66669 12.9998 2.66669C18.9829 2.66669 23.8332 7.51694 23.8332 13.5Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
