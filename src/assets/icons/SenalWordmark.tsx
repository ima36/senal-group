import type { ComponentProps } from 'react'

type Props = ComponentProps<'svg'> & {
  /**
   * Accessible name. Omit it and the mark is hidden from assistive tech —
   * correct when a real heading sits next to it.
   */
  title?: string
}

/**
 * The word "senal" on its own — no "sky", no "site", no "group".
 *
 * The five letterforms are lifted verbatim from the existing brand SVGs, where
 * S, E, N, A and L are already five separate <path> elements: nothing had to be
 * cut out of a merged path, so these are the real letterforms rather than a
 * font approximation.
 *
 * The only change from the source is colour: every path takes `currentColor`
 * instead of a baked-in white, so the same mark works on the charcoal loader,
 * on the hero photo and on a white ground.
 */
const SenalWordmark = ({ title, ...svgProps }: Props) => (
  <svg
    width="242"
    height="57"
    viewBox="0 0 242 57"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role={title ? 'img' : undefined}
    aria-hidden={title ? undefined : true}
    aria-label={title}
    {...svgProps}
  >
    {/* S */}
    <path
      d="M43.9149 13.5825H8.94721V24.2751H40.1581L43.9149 28.032V42.9149L36.9792 50.8621H6.4908L1 44.9379V42.9149H35.9677V32.2223H4.75686L1 28.032V11.1261L5.91282 5.77982H38.4241L43.9149 12.2821V13.5825Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0.288989"
    />
    {/* E */}
    <path
      d="M58.3636 5.77985L51.7168 13.4381V43.0595L58.3636 51.0067H94.3427V49.5617L88.7074 43.0595H59.375V32.2224H86.54V24.4197H63.8543L59.375 28.899V13.4381H88.7074L94.3427 7.22479V5.77985H58.3636Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0.288989"
    />
    {/* N */}
    <path
      d="M105.18 51.0067H106.191V19.6513L133.356 48.5503V51.0067H134.512L141.303 43.0595V13.4381L134.512 5.77985H133.356V36.7017L106.191 8.09176V5.77985H105.18L98.3886 13.4381V43.0595L105.18 51.0067Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0.288989"
    />
    {/* A */}
    <path
      d="M176.832 5.56372L198.073 43.1321L198.124 43.2229L198.055 43.3L191.264 50.8147L191.221 50.8616H154.534L154.49 50.8127L147.844 43.2991L147.776 43.2229L147.826 43.1331L168.777 5.5647L168.819 5.49048H176.791L176.832 5.56372ZM172.725 15.8079L156.854 42.7903L156.726 43.0071H168.457L172.744 47.5793L172.848 47.6897L172.953 47.5813L177.383 43.0071H189.119L188.989 42.7893L172.974 15.8079L172.849 15.5979L172.725 15.8079Z"
      fill="currentColor"
    />
    {/* L */}
    <path
      d="M212.974 5.63531L206.183 13.438V43.0594L212.974 50.8621H240.861V49.5617L236.96 43.0594H218.176L213.985 47.5388V5.63531H212.974Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0.288989"
    />
  </svg>
)

export default SenalWordmark
