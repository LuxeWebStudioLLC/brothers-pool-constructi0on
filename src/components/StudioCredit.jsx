import { useEffect, useRef, useState, useMemo } from 'react'
import { gsap } from '../lib/anim'
import { studio } from '../lib/site'
import { emailRe, sendStudioEnquiry } from '../lib/forms'
import Field from './Field'
import { Arrow, Check } from './Icons'
import { motionReady } from '../lib/motion'

const blank = { name: '', email: '', business: '', type: '', message: '' }

/**
 * Quiet studio credit in the very bottom bar. Clicking it opens a modal that
 * pitches the studio and captures the enquiry — routed to the studio's own
 * endpoint, never the client's.
 */
export default function StudioCredit() {
  const [open, setOpen] = useState(false)
  const [v, setV] = useState(blank)
  const [errors, setErrors] = useState({})
  const [state, setState] = useState('idle') // idle | sending | done | error

  const panel = useRef(null)
  const closeBtn = useRef(null)
  const opener = useRef(null)

  const set = (k) => (e) => {
    setV((p) => ({ ...p, [k]: e.target.value }))
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }))
  }

  const progress = useMemo(() => {
    const checks = [v.name.trim().length > 1, emailRe.test(v.email), !!v.type]
    return Math.round((checks.filter(Boolean).length / checks.length) * 100)
  }, [v])

  // Escape to close, and lock the page behind the modal.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeBtn.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      opener.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open || !motionReady() || !panel.current) return
    const ctx = gsap.context(() => {
      gsap.from('[data-studio-card]', { y: 34, autoAlpha: 0, duration: 0.8, ease: 'expo.out' })
      gsap.from('[data-studio-item]', {
        y: 18, autoAlpha: 0, duration: 0.7, stagger: 0.05, ease: 'expo.out', delay: 0.1,
      })
    }, panel)
    return () => ctx.revert()
  }, [open, state])

  const submit = async (e) => {
    e.preventDefault()
    const next = {}
    if (v.name.trim().length < 2) next.name = 'Your name, please.'
    if (!emailRe.test(v.email)) next.email = 'We need a valid email to reply.'
    if (!v.type) next.type = 'What kind of project is it?'
    setErrors(next)
    if (Object.keys(next).length) return
    setState('sending')
    try {
      await sendStudioEnquiry(v)
      setState('done')
    } catch {
      setState('error')
    }
  }

  return (
    <>
      {/* ── The credit line ───────────────────────────────────────────── */}
      <div className="border-t border-white/8">
        <div className="shell flex items-center justify-center py-5">
          <p className="font-sans text-[0.75rem] text-white/25">
            Built by{' '}
            <button
              ref={opener}
              type="button"
              onClick={() => setOpen(true)}
              className="link-draw font-medium text-white/55 transition-colors duration-300 hover:text-ember"
            >
              {studio.name}
            </button>
          </p>
        </div>
      </div>

      {/* ── Modal ─────────────────────────────────────────────────────── */}
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={studio.heading}
        aria-hidden={!open}
        className={[
          'fixed inset-0 z-[100] flex items-end justify-center p-0 transition-[opacity,visibility] duration-400 sm:items-center sm:p-6',
          open ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0',
        ].join(' ')}
      >
        <div
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-ink/85 backdrop-blur-md"
          aria-hidden="true"
        />

        <div
          data-studio-card
          className="caustics relative max-h-[92svh] w-full max-w-2xl overflow-y-auto border border-white/12 bg-deep shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] sm:max-h-[88svh]"
        >
          <div className="h-[2px] w-full bg-white/8">
            <div
              className="h-full bg-gradient-to-r from-aqua to-ember transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ width: `${state === 'done' ? 100 : progress}%` }}
            />
          </div>

          <button
            ref={closeBtn}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-4 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors duration-300 hover:border-white/40 hover:text-white"
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>

          {state === 'done' ? (
            <div className="px-7 py-16 text-center sm:px-12">
              <div data-studio-item className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-ember/40 bg-ember/10 text-ember">
                <Check size={24} />
              </div>
              <h3 data-studio-item className="mt-7 font-serif text-[1.75rem] text-white">
                Thanks — we&apos;ll be in touch.
              </h3>
              <p data-studio-item className="mx-auto mt-4 max-w-sm text-pretty font-sans text-[0.9375rem] leading-relaxed text-white/60">
                Expect a reply within a day or so, with a couple of questions and a rough idea of
                scope and cost.
              </p>
              <button
                data-studio-item
                type="button"
                onClick={() => setOpen(false)}
                className="mt-9 font-sans text-[0.75rem] uppercase tracking-[0.2em] text-white/35 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white/70"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="px-7 py-10 sm:px-12 sm:py-12">
              <p data-studio-item className="eyebrow eyebrow-ember text-aqua-lit">
                {studio.name}
              </p>

              <h3 data-studio-item className="mt-5 text-balance font-serif text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.1] text-white">
                {studio.heading}
              </h3>

              <p data-studio-item className="mt-5 max-w-lg text-pretty font-sans text-[0.9375rem] leading-relaxed text-white/65">
                {studio.lede}
              </p>

              <ul data-studio-item className="mt-6 space-y-2.5 border-y border-white/10 py-6">
                {studio.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-3">
                    <Check size={14} className="mt-1 shrink-0 text-ember" />
                    <span className="font-sans text-[0.875rem] text-white/70">{pt}</span>
                  </li>
                ))}
              </ul>

              <div data-studio-item className="mt-7 grid gap-5 sm:grid-cols-2">
                <Field label="Your name" name="s-name" required value={v.name} onChange={set('name')} error={errors.name} autoComplete="name" />
                <Field label="Email" name="s-email" type="email" required value={v.email} onChange={set('email')} error={errors.email} autoComplete="email" />
                <Field label="Business name" name="s-business" value={v.business} onChange={set('business')} autoComplete="organization" />
                <Field label="What do you need?" name="s-type" as="select" required options={studio.projectTypes} value={v.type} onChange={set('type')} error={errors.type} />
                <Field
                  className="sm:col-span-2"
                  as="textarea"
                  rows={3}
                  label="Anything else?"
                  name="s-message"
                  value={v.message}
                  onChange={set('message')}
                  hint="Optional — your current site, timing, or what you liked here."
                />
              </div>

              <div data-studio-item className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-sans text-[0.75rem] text-white/40">
                  Or email{' '}
                  <a href={`mailto:${studio.email}`} className="link-draw font-medium text-white/70">
                    {studio.email}
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
                  That didn&apos;t send. Please email {studio.email} instead.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </>
  )
}
