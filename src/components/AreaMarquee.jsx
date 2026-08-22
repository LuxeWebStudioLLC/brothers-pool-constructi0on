import { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger } from '../lib/anim'
import { company, serviceAreas } from '../lib/site'
import { motionReady, useMotionGate } from '../lib/motion'

/**
 * Slow ticker of the places we work. It drifts on its own, but scrolling adds
 * to it and reversing the page reverses the drift — the movement stays tied to
 * what the visitor is doing rather than looping obliviously.
 */
export default function AreaMarquee() {
  const gate = useMotionGate()
  const root = useRef(null)

  useEffect(() => {
    if (!motionReady()) return

    const ctx = gsap.context(() => {
      const drift = gsap.to('[data-marquee-track]', {
        xPercent: -50,
        duration: 34,
        ease: 'none',
        repeat: -1,
      })

      // Scrolling adds to the drift and reversing the page reverses it, so the
      // movement stays tied to what the visitor is doing.
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const boost = Math.min(Math.abs(self.getVelocity()) / 260, 5)
          gsap.to(drift, {
            timeScale: (self.direction === -1 ? -1 : 1) * (1 + boost),
            duration: 0.45,
            overwrite: true,
          })
        },
      })

      return () => {
        drift.kill()
        st.kill()
      }
    }, root)

    return () => ctx.revert()
  }, [gate])

  // Two identical halves so the -50% wrap is seamless.
  // The radius rides along in the loop so the towns never read as the full list.
  const half = [...serviceAreas, `+ ${company.serviceRadiusMiles} miles around`]
  const row = [...half, ...half]

  return (
    <section
      ref={root}
      aria-label="Areas we serve"
      className="relative overflow-hidden border-y border-hairline bg-deep py-8 lg:py-10"
    >
      <div data-marquee-track className="flex w-max items-center gap-10 lg:gap-14">
        {row.map((area, i) => (
          <span key={`${area}-${i}`} className="flex shrink-0 items-center gap-10 lg:gap-14">
            <span
              className={`whitespace-nowrap font-display text-[1.375rem] font-semibold tracking-[-0.02em] lg:text-[2rem] ${
                area.startsWith('+') ? 'italic text-ember/70' : 'text-white/25'
              }`}
            >
              {area}
            </span>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ember/70" aria-hidden="true" />
          </span>
        ))}
      </div>

      {/* soften the edges so words don't hard-cut at the viewport */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-deep to-transparent lg:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-deep to-transparent lg:w-32" />
    </section>
  )
}
