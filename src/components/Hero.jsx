import { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger } from '../lib/anim'
import { company } from '../lib/site'
import { Arrow, ArrowDown } from './Icons'
import { motionReady, useMotionGate } from '../lib/motion'

export default function Hero() {
  const gate = useMotionGate()
  const root = useRef(null)

  useEffect(() => {
    if (!motionReady()) {
      // No entrance animation — release the initial frame clip immediately.
      root.current
        ?.querySelector('[data-hero-frame]')
        ?.style.setProperty('clip-path', 'inset(0% 0% 0% 0%)')
      return
    }
    const ctx = gsap.context(() => {
      // Opening sequence
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      // The frame opens outward to full bleed rather than simply fading up.
      tl.fromTo(
        '[data-hero-frame]',
        { clipPath: 'inset(9% 9% 9% 9%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.9, ease: 'expo.inOut' }
      )
        .from('[data-hero-media]', { scale: 1.18, duration: 2.4, ease: 'power2.out' }, 0)
        .from('[data-hero-veil]', { autoAlpha: 0, duration: 1.4 }, 0)
        .from('[data-hero-eyebrow]', { y: 18, autoAlpha: 0, duration: 1 }, 0.45)
        .from('[data-hero-logo]', { y: 34, autoAlpha: 0, duration: 1.3 }, 0.55)
        .from('[data-hero-line]', { yPercent: 110, duration: 1.25, stagger: 0.1 }, 0.75)
        .from('[data-hero-sub]', { y: 22, autoAlpha: 0, duration: 1.1 }, 1.0)
        .from('[data-hero-cta]', { y: 20, autoAlpha: 0, duration: 1, stagger: 0.09 }, 1.15)
        .from('[data-hero-cue]', { autoAlpha: 0, duration: 1 }, 1.4)

      // Media drifts slower than the page; copy lifts away and fades.
      gsap.to('[data-hero-media]', {
        yPercent: 16,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('[data-hero-copy]', {
        yPercent: -14,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: '25% top', end: 'bottom top', scrub: true },
      })
      gsap.to('[data-hero-cue]', {
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: '18% top', scrub: true },
      })
    }, root)

    return () => ctx.revert()
  }, [gate])

  return (
    <section
      ref={root}
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ink"
    >
      {/* ── Media ────────────────────────────────────────────────────────
          Drop a loop here when the footage is ready — same classes, and the
          poster keeps the layout identical until it loads:
          <video data-hero-media autoPlay muted loop playsInline
                 poster="/img/hero-pool.jpg" src="/video/hero.mp4"
                 className="absolute inset-0 h-[118%] w-full object-cover" />
      */}
      <div
        data-hero-frame
        className="absolute inset-0 -z-10 overflow-hidden"
        style={{ clipPath: 'inset(9% 9% 9% 9%)' }}
      >
        <img
          data-hero-media
          src="/img/hero-pool.jpg"
        alt="Aerial view of a Brothers Pool Construction shotcrete pool with raised spa on a waterfront lot near Myrtle Beach"
          className="absolute inset-0 h-[118%] w-full object-cover"
          style={{ willChange: 'transform' }}
          fetchPriority="high"
        />
      </div>

      <div
        data-hero-veil
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,20,28,0.78)_0%,rgba(5,20,28,0.5)_38%,rgba(5,20,28,0.72)_78%,rgba(5,20,28,0.95)_100%)]"
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(58%_50%_at_50%_45%,transparent_0%,rgba(5,20,28,0.55)_100%)]" />

      <div data-hero-copy className="shell relative pb-28 pt-32 text-center lg:pb-36">
        <p
          data-hero-eyebrow
          className="eyebrow eyebrow-ember mx-auto justify-center text-aqua-lit before:w-6 lg:before:w-9"
        >
          Est. 1992 · Myrtle Beach, SC
        </p>

        <img
          data-hero-logo
          src="/img/logo.png"
          alt={company.name}
          className="mx-auto mt-8 w-[min(78vw,560px)]"
          style={{ filter: 'drop-shadow(0 12px 44px rgba(0,0,0,0.55))' }}
        />

        <h1 className="mx-auto mt-9 max-w-4xl fluid-display font-medium text-white">
          <span className="block overflow-hidden">
            <span data-hero-line className="block">Concrete pools,</span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero-line className="block">
              built <span className="italic font-normal text-aqua-lit">properly</span>.
            </span>
          </span>
        </h1>

        <p
          data-hero-sub
          className="mx-auto mt-8 max-w-2xl text-pretty font-sans text-[1.0625rem] leading-relaxed text-white/70 lg:text-lg"
        >
          Three decades of shotcrete construction, renovation and outdoor living across the Grand
          Strand — designed, poured and finished by our own crews.
        </p>

        <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a data-hero-cta href="#contact" className="btn btn-white w-full sm:w-auto">
            <span>
              Request a Consultation
              <Arrow size={16} />
            </span>
          </a>
          <a data-hero-cta href="#work" className="btn btn-outline w-full sm:w-auto">
            <span>View Our Work</span>
          </a>
        </div>
      </div>

      <a
        data-hero-cue
        href="#services"
        aria-label="Scroll to services"
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/50 transition-colors duration-300 hover:text-white lg:flex"
      >
        <span className="font-sans text-[0.625rem] uppercase tracking-[0.28em]">Scroll</span>
        <ArrowDown size={16} className="animate-bounce" />
      </a>
    </section>
  )
}
