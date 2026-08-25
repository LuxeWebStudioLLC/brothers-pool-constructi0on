import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/anim'
import { company, budgetRange } from '../lib/site'
import { emailRe, phoneRe, formatPhone, sendEnquiry } from '../lib/forms'
import BudgetSlider from './BudgetSlider'
import { Arrow, Check, Phone } from './Icons'
import { motionReady } from '../lib/motion'

const KEY = 'bpc:quote-prompt'
const SNOOZE_DAYS = 7
const DELAY_MS = 3200

/**
 * Compact enquiry prompt shown shortly after load.
 *
 * Deliberately a corner card rather than a full-screen interstitial: Google
 * demotes mobile pages that cover content on arrival, and this is a lead-gen
 * site where that penalty would be expensive. Dismissal is remembered for a
 * week so returning visitors are not nagged.
 */
export default function QuotePopup() {
  const [open, setOpen] = useState(false)
  const [v, setV] = useState({ name: '', phone: '', email: '', budget: budgetRange.min, budgetTouched: false })
  const [errors, setErrors] = useState({})
  const [state, setState] = useState('idle')
  const card = useRef(null)

  useEffect(() => {
    let snoozedUntil = 0
    try {
      snoozedUntil = Number(window.localStorage.getItem(KEY) || 0)
    } catch {
      /* storage blocked — just show it */
    }
    if (Date.now() < snoozedUntil) return

    const show = () => setTimeout(() => setOpen(true), DELAY_MS)
    if (document.readyState === 'complete') show()
    else {
      window.addEventListener('load', show, { once: true })
      return () => window.removeEventListener('load', show)
    }
  }, [])

  const snooze = () => {
    try {
      window.localStorage.setItem(KEY, String(Date.now() + SNOOZE_DAYS * 864e5))
    } catch { /* ignore */ }
  }

  const close = () => { snooze(); setOpen(false) }

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (!open || !motionReady() || !card.current) return
    const ctx = gsap.context(() => {
      gsap.from(card.current, { y: 28, autoAlpha: 0, duration: 0.9, ease: 'expo.out' })
    })
    return () => ctx.revert()
  }, [open])

  const set = (k) => (e) => {
    const raw = e.target.value
    setV((p) => ({ ...p, [k]: k === 'phone' ? formatPhone(raw) : raw }))
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }))
  }

  const submit = async (e) => {
    e.preventDefault()
    const next = {}
    if (v.name.trim().length < 2) next.name = 'Your name'
    if (!phoneRe.test(v.phone)) next.phone = 'A number we can call'
    if (!emailRe.test(v.email)) next.email = 'A valid email address'
    setErrors(next)
    if (Object.keys(next).length) return
    setState('sending')
    try {
      const { budgetTouched, budget, ...rest } = v
      await sendEnquiry({
        ...rest,
        city: 'Not specified',
        services: 'Not specified',
        budget: budgetTouched
          ? budget >= budgetRange.max
            ? `$${budgetRange.max},000+`
            : `$${budget},000`
          : 'Not specified',
        message: 'Sent from the quick-quote prompt.',
        consent: 'Given by submitting the website enquiry form',
        source: 'Quick quote prompt',
      })
      setState('done')
      snooze()
    } catch {
      setState('error')
    }
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-label="Request a consultation"
      className="fixed inset-x-0 bottom-0 z-[90] p-3 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:p-0"
    >
      <div
        ref={card}
        className="relative w-full overflow-hidden border border-white/12 bg-deep shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)] sm:w-[23rem]"
      >
        <span className="block h-[2px] w-full bg-gradient-to-r from-aqua to-ember" />

        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-white/45 transition-colors duration-300 hover:bg-white/10 hover:text-white"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>

        {state === 'done' ? (
          <div className="px-6 py-8 text-center">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-aqua/40 bg-aqua/10 text-aqua">
              <Check size={20} />
            </span>
            <p className="mt-4 font-serif text-[1.25rem] text-white">Thanks — that&apos;s with us.</p>
            <p className="mt-2 font-sans text-[0.8125rem] leading-relaxed text-white/55">
              We&apos;ll call you back shortly.
            </p>
            <button type="button" onClick={() => setOpen(false)}
              className="mt-5 font-sans text-[0.6875rem] uppercase tracking-[0.2em] text-white/35 underline decoration-white/20 underline-offset-4 hover:text-white/70">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="px-6 pb-6 pt-7">
            <p className="eyebrow eyebrow-ember text-aqua-lit">Free consultation</p>
            <p className="mt-3 text-balance font-serif text-[1.375rem] leading-snug text-white">
              Thinking about a project?
            </p>
            <p className="mt-2 font-sans text-[0.8125rem] leading-relaxed text-white/55">
              Leave a number and we&apos;ll call you back — no obligation.
            </p>

            <div className="mt-5 space-y-3">
              <input
                className={`field field-plain !py-3 !pt-3 ${errors.name ? 'field-err' : ''}`}
                placeholder="Name" aria-label="Name" value={v.name} onChange={set('name')} autoComplete="name"
              />
              <input
                className={`field field-plain !py-3 !pt-3 ${errors.phone ? 'field-err' : ''}`}
                placeholder="Phone" aria-label="Phone" value={v.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel"
              />
              <input
                className={`field field-plain !py-3 !pt-3 ${errors.email ? 'field-err' : ''}`}
                placeholder="Email" aria-label="Email" value={v.email} onChange={set('email')} autoComplete="email"
              />
            </div>

            <div className="mt-5">
              <BudgetSlider
                className=""
                value={v.budget}
                touched={v.budgetTouched}
                onChange={(n) => setV((p) => ({ ...p, budget: n, budgetTouched: true }))}
              />
            </div>

            {Object.keys(errors).length > 0 && (
              <p className="mt-3 font-sans text-[0.75rem] text-[#F2A08C]">
                {Object.values(errors).filter(Boolean)[0]}
              </p>
            )}

            <button type="submit" disabled={state === 'sending'} className="btn btn-white mt-4 w-full disabled:opacity-70">
              <span>
                {state === 'sending' ? 'Sending…' : 'Request a call back'}
                {state !== 'sending' && <Arrow size={15} />}
              </span>
            </button>

            {state === 'error' && (
              <p className="mt-3 font-sans text-[0.75rem] text-[#F2A08C]">
                That didn&apos;t send — please call {company.phone}.
              </p>
            )}

            <a href={company.phoneHref} className="mt-4 flex items-center justify-center gap-2 font-sans text-[0.75rem] text-white/40 transition-colors hover:text-white/70">
              <Phone size={13} className="text-aqua" />
              or call {company.phone}
            </a>
          </form>
        )}
      </div>
    </div>
  )
}
