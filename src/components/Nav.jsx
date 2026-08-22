import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/anim'
import { company, nav } from '../lib/site'
import { Phone, Arrow } from './Icons'
import { motionReady, useMotionGate } from '../lib/motion'

export default function Nav() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const gate = useMotionGate()
  const panel = useRef(null)
  const barRef = useRef(null)

  // Swap to the solid bar once the hero is behind us.
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.72)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock the page behind the mobile panel.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Stagger the panel links in.
  useEffect(() => {
    if (!open || !motionReady() || !panel.current) return
    const ctx = gsap.context(() => {
      gsap.from('[data-mobile-item]', {
        y: 26, autoAlpha: 0, duration: 0.85, stagger: 0.06, ease: 'expo.out', delay: 0.12,
      })
    }, panel)
    return () => ctx.revert()
  }, [gate, open])

  // Reveal the bar after the hero has settled.
  useEffect(() => {
    if (!motionReady()) return
    gsap.from(barRef.current, { y: -28, autoAlpha: 0, duration: 1.1, delay: 0.35, ease: 'expo.out' })
  }, [gate])

  return (
    <>
      <header
        ref={barRef}
        className={[
          'fixed inset-x-0 top-0 transition-[background-color,backdrop-filter,box-shadow,border-color] duration-500',
          // The bar is its own stacking context, so it has to sit above the
          // mobile panel itself — otherwise the close button is unreachable.
          open ? 'z-[70]' : 'z-50',
          open
            ? 'border-b border-transparent bg-transparent'
            : solid
              ? 'border-b border-white/10 bg-ink/92 backdrop-blur-xl shadow-[0_10px_40px_-24px_rgba(0,0,0,0.9)]'
              : 'border-b border-transparent bg-gradient-to-b from-black/55 to-transparent',
        ].join(' ')}
        style={{ willChange: 'transform' }}
      >
        <div className="shell flex items-center justify-between gap-6 py-4 lg:py-5">
          <a href="#top" aria-label={`${company.name} — home`} className="shrink-0">
            <img
              src="/img/logo.png"
              alt={company.name}
              className="h-7 w-auto lg:h-8"
              style={{ filter: 'drop-shadow(0 2px 14px rgba(0,0,0,0.5))' }}
            />
          </a>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="link-draw font-display text-[0.8125rem] font-medium tracking-[0.03em] text-white/80 transition-colors duration-300 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-7 lg:flex">
            <a
              href={company.phoneHref}
              className="link-draw font-display text-[0.8125rem] font-semibold tracking-[0.02em] text-white"
            >
              <Phone size={15} className="text-aqua" />
              {company.phone}
            </a>
            <a href="#contact" className="btn btn-white !px-6 !py-3.5">
              <span>Request a Consultation</span>
            </a>
          </div>

          {/* Mobile trigger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="relative flex h-11 w-11 flex-col items-center justify-center gap-[6px] rounded-sm border border-white/20 transition-colors duration-300 hover:border-white/45 lg:hidden"
          >
            <span
              className={`block h-[1.5px] w-5 bg-white transition-all duration-400 ${open ? 'translate-y-[3.75px] rotate-45' : ''}`}
            />
            <span
              className={`block h-[1.5px] w-5 bg-white transition-all duration-400 ${open ? '-translate-y-[3.75px] -rotate-45' : ''}`}
            />
          </button>
        </div>
      </header>

      {/* Mobile panel */}
      <div
        ref={panel}
        className={[
          'fixed inset-0 z-[60] transition-[opacity,visibility] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden',
          // Visibility has to move with the opacity, or the links keep painting
          // over the hero while the panel is closed.
          open
            ? 'pointer-events-auto visible opacity-100'
            : 'pointer-events-none invisible opacity-0',
        ].join(' ')}
        aria-hidden={!open}
      >
        <div onClick={() => setOpen(false)} className="absolute inset-0 bg-ink" />
        <div className="caustics relative flex h-full flex-col justify-between px-6 pb-10 pt-28">
          <nav className="flex flex-col" aria-label="Mobile">
            {nav.map((item, i) => (
              <a
                key={item.href}
                data-mobile-item
                href={item.href}
                onClick={() => setOpen(false)}
                className="group flex items-baseline justify-between border-b border-white/10 py-5"
              >
                <span className="font-serif text-[2rem] font-medium tracking-[-0.02em] text-white">
                  {item.label}
                </span>
                <span className="font-sans text-[0.625rem] tracking-[0.28em] text-aqua">
                  0{i + 1}
                </span>
              </a>
            ))}
          </nav>

          <div data-mobile-item className="space-y-3">
            <a href={company.phoneHref} className="btn btn-outline w-full">
              <span>
                <Phone size={15} />
                {company.phone}
              </span>
            </a>
            <a href="#contact" onClick={() => setOpen(false)} className="btn btn-white w-full">
              <span>
                Request a Consultation
                <Arrow size={16} />
              </span>
            </a>
            <p className="pt-2 text-center font-sans text-[0.6875rem] uppercase tracking-[0.22em] text-white/40">
              {company.region}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
