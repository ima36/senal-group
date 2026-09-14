const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/**
 * Turns the two opening-hour timestamps into "Mon - Sat" / "09:00 - 17:00".
 *
 * Returns empty strings when either date is missing or unparseable, so a blank
 * CMS field renders as nothing rather than "Invalid Date - Invalid Date".
 */
export function formatDateRange(
  startStr?: string | null,
  endStr?: string | null,
): { days: string; time: string } {
  if (!startStr || !endStr) return { days: '', time: '' }

  const start = new Date(startStr)
  const end = new Date(endStr)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { days: '', time: '' }
  }

  const pad = (n: number) => n.toString().padStart(2, '0')
  const shortDay = (d: Date) => WEEKDAYS[d.getDay()].slice(0, 3)

  return {
    days: `${shortDay(start)} - ${shortDay(end)}`,
    time: `${pad(start.getHours())}:${pad(start.getMinutes())} - ${pad(end.getHours())}:${pad(end.getMinutes())}`,
  }
}

/**
 * Digits only — WhatsApp's wa.me links reject "+", spaces and dashes.
 * Returns null when there is no usable number so callers can hide the link
 * entirely instead of rendering a dead https://wa.me/undefined.
 */
export function whatsappLink(...candidates: (string | null | undefined)[]): string | null {
  for (const candidate of candidates) {
    const digits = candidate?.replace(/\D/g, '') ?? ''
    if (digits.length >= 6) return `https://wa.me/${digits}`
  }
  return null
}

/**
 * A mailto: for the contact form, or null when no address is configured.
 * Same reasoning as whatsappLink — better no link than `mailto:undefined`.
 */
export function mailtoLink(
  email: string | null | undefined,
  subject: string,
  body: string,
): string | null {
  const trimmed = email?.trim()
  if (!trimmed || !trimmed.includes('@')) return null
  return `mailto:${trimmed}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

/** "1234.5" -> "1,234.5" */
export function numberWithCommas(x: number | string): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
