'use client'

import { useId, useState, type FormEvent, type ReactNode } from 'react'

import { ClockIcon } from '@/assets/icons/ClockIcon'
import { LocationIcon } from '@/assets/icons/LocationIcon'
import { MailIcon } from '@/assets/icons/MailIcon'
import { PhoneIcon } from '@/assets/icons/PhoneIcon'
import UnderlinedHeader from '@/lib/components/common/UnderlinedHeader'
import Button from '@/lib/components/ui/Button'
import Flexbox from '@/lib/components/ui/Flexbox'
import { useContact } from '@/lib/providers/ContactProvider'
import { formatDateRange, mailtoLink, whatsappLink } from '@/lib/utils/functions/helper.functions'
import { cn } from '@/lib/utils/functions/misc.functions'

type FormState = {
  name: string
  phoneNumber: string
  email: string
  request: string
}

type FormErrors = Partial<Record<keyof FormState | 'form', string>>

const EMPTY_FORM: FormState = { name: '', phoneNumber: '', email: '', request: '' }

const INPUT_CLASS =
  'w-full rounded-[10px] border border-transparent bg-white px-4 py-3 text-charcoal placeholder:text-sm placeholder:text-charcoalLight/70 focus:outline-none focus:ring-2 focus:ring-gold lg:placeholder:text-base'

const INVALID_CLASS = 'border-red-700 ring-1 ring-red-700'

/**
 * Get In Touch.
 *
 * Ported from the Senal Sky home page with four defects fixed:
 *
 *  1. validation called `alert()`, a blocking dialog that says nothing about
 *     which field is wrong and cannot be read by a screen reader in place. It
 *     is now inline, per-field, with aria-invalid and an aria-live region.
 *  2. the WhatsApp link was `https://wa.me/${phone1 || phone2}`, which renders
 *     `wa.me/undefined` when both are blank. whatsappLink() returns null and
 *     the link is dropped.
 *  3. two stray console.log calls shipped to production.
 *  4. contact details came from a third useQuery of the same global, under a
 *     third query key. They now come from ContactProvider, fetched once on the
 *     server in the layout.
 */
export const GetInTouch = () => {
  const contact = useContact()
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [sent, setSent] = useState(false)

  const fieldId = useId()
  const id = (field: string) => `${fieldId}-${field}`
  const errorId = (field: string) => `${fieldId}-${field}-error`

  const { days, time } = formatDateRange(contact.startingOpeningHour, contact.endingOpeningHour)
  const whatsapp = whatsappLink(contact.phoneNumber1, contact.phoneNumber2)
  const phones = [contact.phoneNumber1, contact.phoneNumber2].filter(Boolean).join('  ')

  const update = (field: keyof FormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }))
    setSent(false)
  }

  const validate = (values: FormState): FormErrors => {
    const next: FormErrors = {}

    if (!values.name.trim()) next.name = 'Please tell us your name.'
    if (!values.request.trim()) next.request = 'Please tell us what you need.'

    const hasPhone = values.phoneNumber.trim().length > 0
    const hasEmail = values.email.trim().length > 0

    if (!hasPhone && !hasEmail) {
      // Either one will do, so the message goes on the pair, not on one field.
      next.form = 'Add a phone number or an email address so we can reply.'
    } else if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      next.email = 'That email address does not look right.'
    }

    return next
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const found = validate(form)
    setErrors(found)

    if (Object.values(found).some(Boolean)) {
      // Move focus to the first thing that needs fixing. The message is wired
      // to the field through aria-describedby, so focusing it is what makes a
      // screen reader read the problem out — no alert(), no live-region spam.
      const firstBad = (['name', 'email', 'phoneNumber', 'request'] as const).find(
        (field) => found[field],
      )
      const target = firstBad ?? (found.form ? 'phoneNumber' : undefined)
      if (target) {
        const element = document.getElementById(
          id(target === 'phoneNumber' ? 'phone' : target),
        )
        if (element instanceof HTMLElement) element.focus()
      }
      return
    }

    const hasPhone = form.phoneNumber.trim().length > 0
    const body = [
      'Hello! I would like to get in touch with you.',
      '',
      `Name: ${form.name.trim()}`,
      hasPhone ? `Phone number: ${form.phoneNumber.trim()}` : `Email: ${form.email.trim()}`,
      `Request: ${form.request.trim()}`,
      '',
      'Thank you!',
    ].join('\n')

    const href = mailtoLink(contact.email, 'Contact request — Senal Group', body)

    if (!href) {
      setErrors({ form: 'No contact address is configured yet. Please try again later.' })
      return
    }

    window.location.href = href
    setForm(EMPTY_FORM)
    setSent(true)
  }

  return (
    <section id="contact" className="w-full scroll-mt-24 pb-20 md:pb-28">
      {/*
        Panel geometry restored to the pre-split original:
        `lg:w-[72.5%] w-4/5 mx-auto lg:py-14 lg:pl-20 p-8 rounded-[10px]
        min-h-[400px]`. Only the ground colour differs — charcoal instead of
        the mauve this section borrowed from Senal Sky, which is the palette
        change that was actually asked for.
      */}
      <div className="relative lg:w-[72.5%] w-4/5 mx-auto lg:py-14 lg:pl-20 p-8 rounded-[10px] min-h-[400px] bg-charcoal">
        <Flexbox row fullWidth className="mb-8 justify-center lg:justify-start">
          <UnderlinedHeader
            text="Get In Touch"
            className="max-w-[13rem]"
            textClassName="text-white"
            ruleClassName="bg-gold"
          />
        </Flexbox>

        <Flexbox fullWidth align="start" className="lg:gap-10 gap-7 lg:flex-row">
          <div className="lg:w-[56%] w-full">
            <form onSubmit={handleSubmit} noValidate className="flex w-full flex-col gap-4">
              <div className="flex w-full flex-col gap-4 lg:flex-row">
                <Field
                  label="Full name"
                  required
                  error={errors.name}
                  id={id('name')}
                  errorId={errorId('name')}
                >
                  <input
                    id={id('name')}
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={(event) => update('name')(event.target.value)}
                    placeholder="Full Name*"
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? errorId('name') : undefined}
                    className={cn(INPUT_CLASS, errors.name && INVALID_CLASS)}
                  />
                </Field>

                <Field
                  label="Phone number"
                  error={errors.phoneNumber}
                  id={id('phone')}
                  errorId={errorId('phone')}
                >
                  <input
                    id={id('phone')}
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phoneNumber}
                    onChange={(event) => update('phoneNumber')(event.target.value)}
                    placeholder="Phone Number"
                    aria-invalid={errors.phoneNumber ? true : undefined}
                    aria-describedby={errors.phoneNumber ? errorId('phone') : undefined}
                    className={cn(INPUT_CLASS, errors.phoneNumber && INVALID_CLASS)}
                  />
                </Field>
              </div>

              <Field label="Email" error={errors.email} id={id('email')} errorId={errorId('email')}>
                <input
                  id={id('email')}
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => update('email')(event.target.value)}
                  placeholder="Email"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? errorId('email') : undefined}
                  className={cn(INPUT_CLASS, errors.email && INVALID_CLASS)}
                />
              </Field>

              <Field
                label="Request"
                required
                error={errors.request}
                id={id('request')}
                errorId={errorId('request')}
              >
                <textarea
                  id={id('request')}
                  name="request"
                  rows={4}
                  value={form.request}
                  onChange={(event) => update('request')(event.target.value)}
                  placeholder="Request*"
                  aria-invalid={errors.request ? true : undefined}
                  aria-describedby={errors.request ? errorId('request') : undefined}
                  className={cn(INPUT_CLASS, 'resize-none', errors.request && INVALID_CLASS)}
                />
              </Field>

              {/* One live region for the messages that belong to the form as a
                  whole rather than to a single field. */}
              <p
                aria-live="polite"
                className={cn('min-h-[1.25rem] text-sm', errors.form ? 'text-red-300' : 'text-gold')}
              >
                {errors.form ?? (sent ? 'Opening your email app…' : '')}
              </p>

              <Button type="submit" variant="light" className="w-full self-start lg:w-fit">
                Send Request
              </Button>
            </form>
          </div>

          <div className="h-0.5 w-full rounded-full bg-gold lg:h-[248px] lg:w-0.5" aria-hidden="true" />

          <address className="flex flex-col gap-4 not-italic">
            {contact.email ? (
              <IconWithText icon={<MailIcon className="text-gold" />}>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-sm leading-6 text-white underline decoration-gold underline-offset-4 lg:text-base"
                >
                  {contact.email}
                </a>
              </IconWithText>
            ) : null}

            {phones ? (
              <IconWithText icon={<PhoneIcon className="text-gold" />}>
                <span className="text-sm leading-6 text-white lg:text-base">{phones}</span>
                {whatsapp ? (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gold underline underline-offset-4"
                  >
                    Message us on WhatsApp
                  </a>
                ) : null}
              </IconWithText>
            ) : null}

            {contact.address ? (
              <IconWithText icon={<LocationIcon className="text-gold" />} wide>
                <span className="whitespace-pre-line text-sm leading-6 text-white lg:text-base">
                  {contact.address}
                </span>
              </IconWithText>
            ) : null}

            {days ? (
              <IconWithText icon={<ClockIcon className="text-gold" />}>
                <span className="text-sm font-bold text-white lg:text-base">Opening hours</span>
                <span className="text-sm leading-6 text-white lg:text-base">{days}</span>
                <span className="text-sm leading-6 text-white lg:text-base">{time}</span>
              </IconWithText>
            ) : null}
          </address>
        </Flexbox>
      </div>
    </section>
  )
}

type FieldProps = {
  label: string
  id: string
  errorId: string
  error?: string
  required?: boolean
  children: ReactNode
}

/**
 * The visible label is the placeholder in this design, so the real <label> is
 * screen-reader-only — a placeholder alone leaves the field unnamed once the
 * user starts typing.
 */
const Field = ({ label, id, errorId, error, required, children }: FieldProps) => (
  <div className="flex w-full flex-col gap-1">
    <label htmlFor={id} className="sr-only">
      {label}
      {required ? ' (required)' : ''}
    </label>
    {children}
    {/* Not a live region: the message is announced through aria-describedby
        when focus lands on the field, which submit-handling arranges. Four
        competing live regions would read every keystroke's worth of change. */}
    <p id={errorId} className="min-h-[1rem] text-sm text-red-300">
      {error ?? ''}
    </p>
  </div>
)

const IconWithText = ({
  icon,
  children,
  wide,
}: {
  icon: ReactNode
  children: ReactNode
  wide?: boolean
}) => (
  <div className="flex flex-row gap-4">
    <span className="mt-0.5 shrink-0">{icon}</span>
    <div className={cn('flex flex-col', wide ? 'lg:w-52' : 'lg:w-40')}>{children}</div>
  </div>
)

export default GetInTouch
