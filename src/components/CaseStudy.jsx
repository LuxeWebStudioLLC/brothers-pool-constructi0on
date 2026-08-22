import { useRef, useEffect } from 'react'
import { gsap } from '../lib/anim'
import { caseStudy, testimonials } from '../lib/site'
import SplitHeading from './SplitHeading'
import Reveal from './Reveal'
import { Arrow } from './Icons'
import { motionReady, useMotionGate } from '../lib/motion'

/**
 * One project, full-bleed, told properly — scope, finish, site conditions and
 * the client's words — instead of another grid cell.
 */
export default function CaseStudy() {
  const gate = useMotionGate()
  const root = useRef(null)
  const quote = testimonials[0]

  useEffect(() => {
    if (!motionReady()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-cs-media]',
        { scale: 1.12 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      )
    }, root)
    return () => ctx.revert()
  }, [gate])

  return (
    <section ref={root} id="case-study" className="relative isolate overflow-hidden bg-ink">
      <img
        data-cs-media
        src={caseStudy.img}
        alt={caseStudy.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ willChange: 'transform' }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,20,28,0.42)_0%,rgba(5,20,28,0.2)_36%,rgba(5,20,28,0.82)_74%,rgba(5,20,28,0.96)_100%)]" />

      <div className="shell relative flex min-h-[94svh] flex-col justify-end pb-16 pt-44 lg:pb-24">
        <Reveal y={14} duration={0.9}>
          <p className="eyebrow eyebrow-ember text-aqua-lit">
            Case study · {caseStudy.location}
          </p>
        </Reveal>

        <SplitHeading className="mt-6 max-w-3xl fluid-h1 text-balance text-white">
          {caseStudy.title}
        </SplitHeading>

        <div className="mt-12 grid gap-12 border-t border-white/15 pt-10 lg:grid-cols-[1.25fr_1fr] lg:gap-24">
          <div>
            <Reveal y={22}>
              <p className="max-w-xl text-pretty font-sans text-[1rem] leading-relaxed text-white/75">
                {caseStudy.body}
              </p>
            </Reveal>
            <Reveal y={22} delay={0.1}>
              <blockquote className="mt-10 max-w-xl border-l border-ember/60 pl-6">
                <p className="font-serif text-[1.25rem] italic leading-[1.45] text-white lg:text-[1.375rem]">
                  “{quote.quote}”
                </p>
                <cite className="mt-4 block font-sans text-[0.75rem] uppercase not-italic tracking-[0.18em] text-white/45">
                  {quote.author} · homeowner
                </cite>
              </blockquote>
            </Reveal>
          </div>

          <Reveal className="self-end" stagger={0.08} y={18}>
            {caseStudy.specs.map((s) => (
              <div key={s.k} className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-white/12 py-4 first:border-t lg:py-5">
                <span className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-ember">
                  {s.k}
                </span>
                <span className="font-sans text-[0.875rem] leading-relaxed text-white/80">{s.v}</span>
              </div>
            ))}
            <a href="#contact" className="btn btn-white mt-8 w-full sm:w-auto">
              <span>
                Start a project like this
                <Arrow size={16} />
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
