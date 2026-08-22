import { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger } from '../lib/anim'
import { timeline } from '../lib/site'
import Reveal from './Reveal'
import { motionReady, useMotionGate } from '../lib/motion'

/**
 * The story as a sticky-backdrop sequence — identical behaviour on phone and
 * desktop.
 *
 * Deliberately NOT a GSAP pin: pinning freezes the page for several viewports,
 * which reads as "this is the bottom of the site". Here the copy scrolls
 * normally and only the photography holds still, via native CSS
 * `position: sticky` — compositor-driven, so it stays smooth on a phone too.
 */
export default function Heritage() {
  const gate = useMotionGate()
  const root = useRef(null)

  useEffect(() => {
    if (!motionReady()) return

    const ctx = gsap.context(() => {
      const medias = gsap.utils.toArray('[data-era-media]')
      const ticks = gsap.utils.toArray('[data-era-tick]')
      const eras = gsap.utils.toArray('[data-era]')

      medias.forEach((img) => img.decode?.().catch(() => {}))

      const activate = (i) => {
        medias.forEach((m, j) =>
          gsap.to(m, {
            autoAlpha: j === i ? 1 : 0,
            duration: 0.9,
            ease: 'power2.inOut',
            overwrite: 'auto',
          })
        )
        ticks.forEach((t, j) =>
          gsap.to(t, {
            scaleX: j <= i ? 1 : 0,
            backgroundColor: j <= i ? '#F2793C' : 'rgba(255,255,255,0.18)',
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        )
      }

      gsap.set(medias.slice(1), { autoAlpha: 0 })
      gsap.set(ticks, { scaleX: 0 })
      activate(0)

      const triggers = eras.map((el, i) =>
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onEnter: () => activate(i),
          onEnterBack: () => activate(i),
        })
      )

      // ONE timeline per era. Two separate scrubbed tweens both writing
      // autoAlpha fought each other every frame, which made the copy snap off
      // instead of fading. A single timeline owns the property end to end:
      // rise in, hold legible for the long middle, lift away.
      const fades = []
      eras.forEach((el) => {
        const inner = el.querySelector('[data-era-inner]')
        // Spans the copy's whole transit through the viewport, so the fade has
        // room to breathe at both ends instead of snapping off.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: inner,
            start: 'top bottom',   // the moment the copy enters from below
            end: 'bottom top',     // until it has fully left the top
            scrub: 1,              // lag smooths the whole transit
          },
          defaults: { force3D: true },
        })
        tl.fromTo(
          inner,
          { autoAlpha: 0, y: 80 },
          { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out' }
        )
          .to(inner, { duration: 1.9 })   // hold — the bulk of the transit
          .to(inner, { autoAlpha: 0, y: -80, duration: 1, ease: 'power2.in' })
        fades.push(tl)
      })

      return () => {
        triggers.forEach((t) => t.kill())
        fades.forEach((f) => { f.scrollTrigger?.kill(); f.kill() })
      }
    }, root)

    return () => ctx.revert()
  }, [gate])

  return (
    <section ref={root} id="about" className="relative isolate bg-ink">
      {/* ── Sticky media layer ──────────────────────────────────────────── */}
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {timeline.map((t) => (
          <img
            key={`m-${t.year}`}
            data-era-media
            src={t.img}
            alt=""
            aria-hidden="true"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ willChange: 'opacity', filter: t.tone || 'none' }}
          />
        ))}

        {/* Heavier scrim on phones, where copy runs the full width. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,20,28,0.84)_0%,rgba(5,20,28,0.58)_40%,rgba(5,20,28,0.88)_100%)] lg:bg-[linear-gradient(180deg,rgba(5,20,28,0.7)_0%,rgba(5,20,28,0.22)_40%,rgba(5,20,28,0.72)_100%)]" />
        <div className="absolute inset-0 lg:bg-[linear-gradient(90deg,rgba(5,20,28,0.86)_0%,rgba(5,20,28,0.46)_46%,rgba(5,20,28,0)_82%)]" />

        {/* Progress rail — visible at every size, so it always reads as
            "there is more below". */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="shell grid grid-cols-4 gap-2 border-t border-white/12 pb-6 pt-4 lg:gap-4 lg:pb-8 lg:pt-5">
            {timeline.map((t) => (
              <div key={`tick-${t.year}`}>
                <span className="block h-px w-full overflow-hidden bg-white/12">
                  <span
                    data-era-tick
                    className="block h-full w-full origin-left bg-white/18"
                    style={{ transform: 'scaleX(0)' }}
                  />
                </span>
                <span className="mt-2 block font-sans text-[0.625rem] uppercase tracking-[0.14em] text-white/40 lg:mt-3 lg:text-[0.6875rem] lg:tracking-[0.2em]">
                  {t.year}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scrolling copy ──────────────────────────────────────────────── */}
      <div className="relative -mt-[100svh]">
        <div className="shell pt-24 lg:pt-32">
          <Reveal y={14} duration={0.9}>
            <p className="eyebrow eyebrow-ember text-aqua-lit">Our story · since 1992</p>
          </Reveal>
        </div>

        {timeline.map((t) => (
          <article
            key={t.year}
            data-era
            className="shell flex min-h-[86svh] items-center py-16 lg:min-h-[92svh] lg:py-0"
          >
            <div
              data-era-inner
              className="max-w-3xl pb-20 lg:pb-24"
              style={{ willChange: 'transform, opacity' }}
            >
              <p className="font-sans text-[0.6875rem] uppercase tracking-[0.22em] text-white/45">
                {t.chapter}
              </p>
              <p className="mt-4 font-serif text-[clamp(3.5rem,9vw,7rem)] font-medium italic leading-[0.9] text-ember">
                {t.year}
              </p>
              <h3 className="mt-6 text-balance font-serif text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.1] text-white">
                {t.title}
              </h3>
              <p className="mt-6 max-w-xl text-pretty font-sans text-[1rem] leading-relaxed text-white/70 lg:text-[1.0625rem]">
                {t.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
