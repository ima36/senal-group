type Props = {
  className?: string
}

/**
 * Stand-in for the CEO portrait until the client supplies a real photograph.
 *
 * The page it was ported from pointed at `/images/ceo.png`, a stock placeholder
 * of someone who is not the CEO. That is worse than no photo, so it is gone.
 * This is a drawn mark in the group's own charcoal and gold — it reads as a
 * deliberate piece of the design rather than a failed image load, and it swaps
 * itself out the moment `ceoPhoto` is set in the CMS.
 *
 * Purely decorative: the name and title sit next to it as real text, so it is
 * hidden from assistive technology.
 */
export const PersonPlaceholder = ({ className }: Props) => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="senal-person-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#D8B44A" />
        <stop offset="100%" stopColor="#C9A227" />
      </linearGradient>
      <clipPath id="senal-person-clip">
        <circle cx="100" cy="100" r="88" />
      </clipPath>
    </defs>

    {/* Ground */}
    <circle cx="100" cy="100" r="100" fill="#1A1A1A" />
    <circle cx="100" cy="100" r="88" fill="#2E2E2E" />

    {/* Thin gold rule just inside the edge */}
    <circle
      cx="100"
      cy="100"
      r="94"
      fill="none"
      stroke="#C9A227"
      strokeOpacity="0.55"
      strokeWidth="1.5"
    />

    <g clipPath="url(#senal-person-clip)" fill="url(#senal-person-gold)">
      {/* Head */}
      <circle cx="100" cy="78" r="28" />
      {/* Shoulders — a plain arc, cropped by the circle */}
      <path d="M100 116c-30.9 0-56 25.1-56 56v28h112v-28c0-30.9-25.1-56-56-56z" />
    </g>
  </svg>
)

export default PersonPlaceholder
