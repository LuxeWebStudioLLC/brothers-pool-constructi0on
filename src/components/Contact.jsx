import { useRef, useState, useEffect, useMemo } from 'react'
import { gsap } from '../lib/anim'
import {
  company, cities, serviceOptions, budgetOptions, timelineOptions,
} from '../lib/site'
import { emailRe, phoneRe, formatPhone, sendEnquiry } from '../lib/forms'
import SectionHead from './SectionHead'
import Reveal from './Reveal'
import Field from './Field'
import ServiceMap from './ServiceMap'
import { Phone, Mail, Pin, Calendar, Arrow, Check, Facebook } from './Icons'
import { motionReady, useMotionGate } from '../lib/motion'

const blank = {
  name: '', email: '', phone: '', city: '', address: '',
  services: [], budget: '', timeline: '', message: '',
}

export default function Contact() {
  const gate = useMotionGate()
  const [v, setV] = useState(blank)
  const [errors, setErrors] = useState({})
  const [state, setState] = useState('idle') // idle | sending | done | error
  const doneRef = useRef(null)

  const set = (k) => (e) => {
    const raw = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setV((p) => ({ ...p, [k]: k === 'phone' ? formatPhone(raw) : raw }))
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }))
  }

  const toggleService = (s) =>
    setV((p) => ({
      ...p,
      services: p.services.includes(s) ? p.services.filter((x) => x !== s) : [...p.services, s],
    }))

  // Quiet completion meter — reads as attentiveness, not a sales funnel.
  const progress = useMemo(() => {
    const checks = [
      v.name.trim().length > 1,
      emailRe.test(v.email),
      phoneRe.test(v.phone),
      !!v.city,
      v.services.length > 0,
      v.message.trim().length > 9,
    ]
    return Math.round((checks.filter(Boolean).length / checks.length) * 100)
  }, [v])

  const validate = () => {
    const e = {}
    if (v.name.trim().length < 2) e.name = 'Please tell us your name.'
    if (!emailRe.test(v.email)) e.email = 'We need a valid email to send your proposal.'
    if (!phoneRe.test(v.phone)) e.phone = 'A reachable phone number, please.'
    if (v.city.trim().length < 2) e.city = 'Which town or ZIP is the property in?'
    // Services and consent are deliberately NOT required. Blocking a lead over
    // an unticked checkbox loses the enquiry entirely; we can ask what they
    // need when we call them back.
    return e
  }

  const submit = async (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length) {
      const first = document.querySelector('.field-err, [data-chip-error]')
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setState('sending')
    try {
      await sendEnquiry({
        ...v,
        services: v.services.join(', ') || 'Not specified',
        consent: 'Given by submitting the website enquiry form',
        source: 'Contact section',
      })
      setState('done')
    } catch {
      setState('error')
    }
  }

  useEffect(() => {
    if (state !== 'done' || !motionReady() || !doneRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('[data-done-item]', {
        y: 24, autoAlpha: 0, duration: 1, stagger: 0.09, ease: 'expo.out',
      })
      gsap.from('[data-done-ring]', {
        scale: 0.5, autoAlpha: 0, duration: 1.1, ease: 'expo.out',
      })
    }, doneRef)
    return () => ctx.revert()
  }, [gate, state])

  return (
    <section id="contact" className="caustics grain section relative overflow-hidden bg-deep">
      <div className="shell relative grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        {/* ── Left: the human side ─────────────────────────────────── */}
        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <SectionHead
            tone="dark"
            eyebrow="Start here"
            title="Tell us about the property"
            lede={`Send this through and one of us — not a call centre — will get back to you in a timely manner to arrange a site visit. We build anywhere within ${company.serviceRadiusMiles} miles of ${company.serviceCentre}.`}
          />

          <Reveal className="mt-12 space-y-px overflow-hidden rounded-[3px] border border-white/12" stagger={0.07} y={20}>
            <ContactRow icon={Phone} label="Call us" value={company.phone} href={company.phoneHref} />
            <ContactRow icon={Mail} label="Email" value={company.email} href={company.emailHref} />
            <ContactRow icon={Pin} label="Service area" value={company.serviceRadius} />
            <ContactRow icon={Calendar} label="Office hours" value={company.hours} />
          </Reveal>

          <ServiceMap className="mt-8" />

          <Reveal className="mt-8 flex items-center gap-3" y={16} delay={0.15}>
            {[{ href: company.facebook, Icon: Facebook, label: 'Facebook' }].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/65 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-aqua hover:bg-aqua hover:text-ink"
              >
                <Icon size={16} />
              </a>
            ))}
          </Reveal>
        </div>

        {/* ── Right: the form ──────────────────────────────────────── */}
        <Reveal y={38} className="min-w-0">
          <div className="relative overflow-hidden rounded-[4px] border border-white/12 bg-white/[0.035] backdrop-blur-sm">
            {/* completion meter */}
            <div className="h-[2px] w-full bg-white/8">
              <div
                className="h-full bg-gradient-to-r from-aqua to-aqua-lit transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ width: `${state === 'done' ? 100 : progress}%` }}
              />
            </div>

            {state === 'done' ? (
              <div ref={doneRef} className="px-7 py-16 text-center lg:px-14 lg:py-20">
                <div
                  data-done-ring
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-aqua/40 bg-aqua/10 text-aqua"
                >
                  <Check size={26} />
                </div>
                <h3 data-done-item className="mt-8 text-balance fluid-h3 font-semibold text-white">
                  Thank you — that&apos;s with us.
                </h3>
                <p data-done-item className="mx-auto mt-5 max-w-md text-pretty font-sans text-[0.9375rem] leading-relaxed text-white/60">
                  We read every enquiry ourselves. Expect a call or email in a timely manner to set
                  up a walk-through of the property.
                </p>
                <p data-done-item className="mt-8 font-sans text-[0.8125rem] text-white/45">
                  Need us sooner?{' '}
                  <a href={company.phoneHref} className="link-draw font-medium text-aqua">
                    {company.phone}
                  </a>
                </p>
                <button
                  data-done-item
                  type="button"
                  onClick={() => { setV(blank); setState('idle') }}
                  className="mt-10 font-sans text-[0.75rem] uppercase tracking-[0.2em] text-white/35 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white/70"
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="p-7 lg:p-10">
                {/* Step 1 */}
                <Legend n="01" title="Who we're speaking with" />
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" name="name" required value={v.name} onChange={set('name')} error={errors.name} autoComplete="name" />
                  <Field label="Email address" name="email" type="email" required value={v.email} onChange={set('email')} error={errors.email} autoComplete="email" />
                  <Field label="Phone" name="phone" type="tel" required value={v.phone} onChange={set('phone')} error={errors.phone} inputMode="tel" autoComplete="tel" />
                  <Field
                    label="City, town or ZIP"
                    name="city"
                    required
                    options={cities}
                    value={v.city}
                    onChange={set('city')}
                    error={errors.city}
                    hint={`Anywhere within ${company.serviceRadiusMiles} miles of ${company.serviceCentre} — type yours, listed or not.`}
                    autoComplete="address-level2"
                  />
                  <Field
                    className="sm:col-span-2"
                    label="Property address"
                    name="address"
                    value={v.address}
                    onChange={set('address')}
                    hint="Optional — helps us check access and site conditions before we call."
                    autoComplete="street-address"
                  />
                </div>

                {/* Step 2 */}
                <Legend n="02" title="What you're planning" className="mt-12" />
                <fieldset className="mt-6">
                  <legend className="mb-4 font-sans text-[0.75rem] uppercase tracking-[0.18em] text-white/45">
                    What are you thinking about?{' '}
                    <span className="normal-case tracking-normal text-white/30">(optional)</span>
                  </legend>
                  <div className="flex flex-wrap gap-2.5" data-chip-error={errors.services ? '' : undefined}>
                    {serviceOptions.map((s) => {
                      const active = v.services.includes(s)
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => { toggleService(s); if (errors.services) setErrors((p) => ({ ...p, services: undefined })) }}
                          aria-pressed={active}
                          className={[
                            'group inline-flex items-center gap-2 rounded-full border px-4 py-2.5 font-sans text-[0.8125rem] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]',
                            active
                              ? 'border-aqua bg-aqua text-ink'
                              : 'border-white/16 text-white/70 hover:border-white/40 hover:text-white',
                          ].join(' ')}
                        >
                          <span
                            className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border transition-colors duration-300 ${
                              active ? 'border-ink/50 bg-ink/15' : 'border-white/30'
                            }`}
                          >
                            {active && <Check size={9} strokeWidth={3} />}
                          </span>
                          {s}
                        </button>
                      )
                    })}
                  </div>
                  {errors.services && (
                    <p className="mt-3 font-sans text-[0.75rem] text-[#F2A08C]">{errors.services}</p>
                  )}
                </fieldset>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field label="Budget range" name="budget" as="select" options={budgetOptions} value={v.budget} onChange={set('budget')} hint="Optional, but it keeps the design realistic." />
                  <Field label="Ideal timeline" name="timeline" as="select" options={timelineOptions} value={v.timeline} onChange={set('timeline')} />
                </div>

                {/* Step 3 */}
                <Legend n="03" title="Anything else we should know" className="mt-12" />
                <div className="mt-6">
                  <Field
                    as="textarea"
                    label="Tell us about the project"
                    name="message"
                    rows={5}
                    value={v.message}
                    onChange={set('message')}
                    hint="Shape and size you have in mind, existing pool condition, deck plans, access constraints — whatever is useful."
                  />
                </div>

                <p className="mt-8 border-t border-white/10 pt-6 font-sans text-[0.8125rem] leading-relaxed text-white/45">
                  By sending this you&apos;re happy for {company.short} to contact you about your
                  enquiry. We don&apos;t share your details and we don&apos;t send marketing you
                  didn&apos;t ask for &mdash;{' '}
                  <a href="/privacy" className="link-draw font-medium text-white/70">
                    privacy policy
                  </a>
                  .
                </p>

                <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-sans text-[0.75rem] text-white/40">
                    Prefer to talk?{' '}
                    <a href={company.phoneHref} className="link-draw font-medium text-white/80">
                      {company.phone}
                    </a>
                  </p>
                  <button type="submit" disabled={state === 'sending'} className="btn btn-white w-full sm:w-auto disabled:opacity-70">
                    <span>
                      {state === 'sending' ? 'Sending…' : 'Send enquiry'}
                      {state !== 'sending' && <Arrow size={16} />}
                    </span>
                  </button>
                </div>

                {state === 'error' && (
                  <p className="mt-5 font-sans text-[0.8125rem] text-[#F2A08C]">
                    That didn&apos;t send. Please try again, or call us on {company.phone} and
                    we&apos;ll take the details over the phone.
                  </p>
                )}
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

const Legend = ({ n, title, className = '' }) => (
  <div className={`flex items-center gap-4 ${className}`}>
    <span className="font-display text-[0.6875rem] font-semibold tracking-[0.2em] text-aqua">{n}</span>
    <span className="h-px flex-1 bg-white/10" />
    <span className="font-sans text-[0.75rem] uppercase tracking-[0.16em] text-white/50">{title}</span>
  </div>
)

const ContactRow = ({ icon: Icon, label, value, href }) => {
  const Inner = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-aqua transition-colors duration-500 group-hover:border-aqua/50">
        <Icon size={16} />
      </span>
      <span className="min-w-0">
        <span className="block font-sans text-[0.6875rem] uppercase tracking-[0.2em] text-white/40">
          {label}
        </span>
        <span className="mt-1 block font-display text-[0.8125rem] font-medium leading-snug text-white [overflow-wrap:anywhere] sm:text-[0.9375rem]">
          {value}
        </span>
      </span>
    </>
  )

  return href ? (
    <a href={href} className="group flex min-w-0 items-start gap-4 bg-white/[0.02] px-5 py-4 transition-colors duration-500 hover:bg-white/[0.055]">
      {Inner}
    </a>
  ) : (
    <div className="flex min-w-0 items-start gap-4 bg-white/[0.02] px-5 py-4">{Inner}</div>
  )
}
