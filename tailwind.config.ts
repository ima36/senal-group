import type { Config } from 'tailwindcss'

/**
 * Senal Group's palette is charcoal + gold — the neutral parent above Senal
 * Sky's mauve and Senal Site's orange. Neither of those brand families exists
 * as a token in this project.
 *
 * Token names map 1:1 onto the CSS custom properties declared in
 * src/lib/styles/globals.scss, same pattern as the sibling projects.
 *
 * Contrast note: `gold` (#C9A227) is ~3.1:1 on white. It is a rules/accents/
 * icons/large-heading colour only. Body copy on light backgrounds uses
 * `charcoal` (~15.9:1 on white). Gold on charcoal is ~6.5:1 and safe for text.
 */
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Declared as `rgb(<channels> / <alpha-value>)` so Tailwind's opacity
        // modifiers compile. As a bare `var(--color-x)` Tailwind silently drops
        // every `bg-charcoal/95`, `bg-ink/70`, `border-gold/60` etc — the class
        // ships in the markup and no rule is ever emitted.
        charcoal: 'rgb(var(--color-charcoal-rgb) / <alpha-value>)',
        charcoalLight: 'rgb(var(--color-charcoal-light-rgb) / <alpha-value>)',
        ink: 'rgb(var(--color-ink-rgb) / <alpha-value>)',
        gold: 'rgb(var(--color-gold-rgb) / <alpha-value>)',
        goldLight: 'var(--color-gold-light)',
        goldLighter: 'var(--color-gold-lighter)',
        grey: 'rgb(var(--color-grey-rgb) / <alpha-value>)',
        greyLight: 'var(--color-grey-light)',
        grey2: 'rgb(var(--color-grey-2-rgb) / <alpha-value>)',
        grey3: 'rgb(var(--color-grey-3-rgb) / <alpha-value>)',
        greyBg: 'rgb(var(--color-grey-bg-rgb) / <alpha-value>)',
      },
      screens: {
        sm: '600px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        'max-sm': { max: '599px' },
        'max-md': { max: '767px' },
        'max-lg': { max: '1023px' },
        'max-xl': { max: '1279px' },
        'max-2xl': { max: '1535px' },
        mobile: { max: '599px' },
        tablet: { min: '600px', max: '767px' },
      },
      borderRadius: {
        '4xl': '3rem',
        pill: '100vh',
        circle: '50%',
      },
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1) translate3d(0, 0, 0)' },
          '100%': { transform: 'scale(1.08) translate3d(0, -1.2%, 0)' },
        },
      },
      animation: {
        shine: 'shine 3s infinite linear',
        kenBurns: 'kenBurns 20s ease-in-out infinite alternate',
      },
      boxShadow: {
        'blur-lg': '0 0 12px 0 rgba(26, 26, 26, 0.10)',
        'blur-xl': '0 0 24px 0 rgba(26, 26, 26, 0.12)',
        header: '0 8px 32px 0 rgba(13, 13, 13, 0.14)',
      },
    },
  },
  plugins: [],
}
export default config
