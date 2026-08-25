import { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger } from '../lib/anim'
import { services } from '../lib/site'
import Reveal from './Reveal'
import SplitHeading from './SplitHeading'
import { Arrow } from './Icons'
import { motionReady, useMotionGate } from '../lib/motion'

/**
 * Services as an editorial index — numbered rows on a shared hairline, not a
 * card grid. The heading is oversized and the lede is tucked into the right
 * column so the section reads asymmetric on purpose.
 */
export default function Services() {
  const gate = useMotionGate()
  const list = useRef(null)

  useEffect(() => {
    if (!motionReady()) return
    const ctx = gsap.context(() => {
      ScrollTrigger.batch('[data-service-row]', {
        start: 'top 90%',
        once: true,
        onEnter: (batch) =>
          gsap.from(batch, {
            y: 44,
            autoAlpha: 0,
            duration: 1.15,
            stagger: 0.09,
            ease: 'expo.out',
          }),
      })
    }, list)
    return () => ctx.revert()
  }, [gate])

  return (
    <section id="services" className="section relative bg-white">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-20">
          <div>
            <Reveal y={14} duration={0.9}>
              <p className="eyebrow text-aqua">What we build</p>
            </Reveal>
            <SplitHeading className="mt-6 fluid-h1 text-balance text-deep">
              Five disciplines, <em className="text-graphite">one team</em>
            </SplitHeading>
          </div>
          <Reveal y={20} delay={0.15} className="lg:pb-2">
            <p className="text-pretty font-sans text-[1.0625rem] leading-relaxed text-graphite">
              Everything from the first survey stake to the last paver is handled by quality
              professionals, ensuring our work will last.
            </p>
            <a href="#contact" className="link-draw mt-6 font-display text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-deep">
              Start a project <Arrow size={15} />
            </a>
          </Reveal>
        </div>

        <div ref={list} className="mt-16 border-t border-stone lg:mt-24">
          {services.map((s) => (
            <article
              key={s.n}
              data-service-row
              className="group grid gap-3 border-b border-stone py-9 transition-colors duration-500 lg:grid-cols-[5.5rem_1.05fr_1.45fr] lg:gap-10 lg:py-12"
            >
              <span className="font-serif text-[1.125rem] italic leading-none text-ember/80 lg:pt-2">
                {s.n}
              </span>
              <h3 className="text-balance font-serif text-[1.625rem] leading-[1.1] text-deep transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 lg:text-[2rem]">
                {s.title}
              </h3>
              <div>
                <p className="text-pretty font-sans text-[0.9375rem] leading-relaxed text-graphite">
                  {s.blurb}
                </p>
                <p className="mt-4 font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-deep/45">
                  {s.points.join('  ·  ')}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
