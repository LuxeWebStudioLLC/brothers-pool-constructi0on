import { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger } from '../lib/anim'
import { stats } from '../lib/site'
import SectionHead from './SectionHead'
import ScrubText from './ScrubText'
import SplitHeading from './SplitHeading'
import Reveal from './Reveal'
import Counter from './Counter'
import { Arrow } from './Icons'
import { motionReady, useMotionGate } from '../lib/motion'

export default function Craft() {
  const gate = useMotionGate()
  const root = useRef(null)

  useEffect(() => {
    if (!motionReady()) return
    const ctx = gsap.context(() => {
      // Slow reveal of the frame, then a long drift on the photo inside it.
      gsap.from('[data-craft-frame]', {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 1.5,
        ease: 'expo.out',
        scrollTrigger: { trigger: '[data-craft-frame]', start: 'top 82%', once: true },
      })
      // Resolved at fire time: SplitText re-wraps the heading, so querying
      // up front could hand us a node that no longer exists.
      ScrollTrigger.create({
        trigger: '[data-craft-heading]',
        start: 'top 78%',
        once: true,
        onEnter: () => {
          const strike = root.current?.querySelector('[data-strike]')
          if (!strike) return
          gsap.fromTo(
            strike,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.85, delay: 0.5, ease: 'expo.out' }
          )
          const swap = root.current?.querySelector('[data-replacement]')
          if (swap) {
            gsap.from(swap, {
              autoAlpha: 0,
              y: '0.18em',
              duration: 0.8,
              delay: 1.05,
              ease: 'expo.out',
            })
          }
        },
      })

      gsap.fromTo(
        '[data-craft-img]',
        { yPercent: -9 },
        {
          yPercent: 9,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      )
    }, root)
    return () => ctx.revert()
  }, [gate])

  return (
    <section
      ref={root}
      id="craft"
      className="caustics grain section relative overflow-hidden bg-deep"
    >
      <div className="shell relative grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal y={14} duration={0.9}>
            <p className="eyebrow text-aqua">Why it lasts</p>
          </Reveal>
          <SplitHeading data-craft-heading className="mt-5 fluid-h2 text-balance text-white">
            More than meets the{' '}
            <span className="relative inline-block whitespace-nowrap">
              eye
              {/* Rule is drawn on scroll, so the word is struck out in front of
                  the reader rather than arriving pre-crossed. */}
              <span
                data-strike
                aria-hidden="true"
                className="absolute left-[-0.08em] right-[-0.08em] top-[0.585em] block h-[0.052em] origin-left rounded-full bg-ember"
                style={{ transform: 'scaleX(0)' }}
              />
            </span>{' '}
            {/* The correction lands after the strike, so the line reads as a
                thought being changed rather than a pre-set punchline. */}
            <span data-replacement className="inline-block text-aqua-lit">
              pool
            </span>
          </SplitHeading>
          <ScrubText className="mt-7 max-w-xl text-pretty font-sans text-[1.0625rem] leading-relaxed text-white lg:text-[1.125rem]">
            What decides whether a pool still looks right in twenty years is underneath it — how the
            steel was tied, how the shotcrete was shot and cured, how the finish was bonded. We refuse
            to cut corners.
          </ScrubText>

          <Reveal className="mt-11 grid grid-cols-2 gap-x-8 gap-y-9" stagger={0.1} y={26}>
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-serif text-[2.75rem] font-medium leading-none tracking-[-0.02em] text-white lg:text-[3.25rem]">
                  <Counter value={s.value} suffix={s.suffix} suffixClassName="text-ember" />
                </p>
                <p className="mt-3 font-sans text-[0.8125rem] leading-snug text-white/55">
                  {s.label}
                </p>
              </div>
            ))}
          </Reveal>

          <Reveal className="mt-12" y={18} delay={0.15}>
            <a href="#process" className="link-draw font-display text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-white">
              See how we build <Arrow size={15} className="text-aqua" />
            </a>
          </Reveal>
        </div>

        <div data-craft-frame className="relative overflow-hidden rounded-[3px]">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              data-craft-img
              src="/img/pool-freeform.jpg"
              alt="Freeform shotcrete pool with spa and travertine paver deck built by Brothers Pool Construction"
              loading="lazy"
              className="absolute inset-0 h-[118%] w-full object-cover"
              style={{ willChange: 'transform' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 border-t border-white/15 bg-ink/70 p-6 backdrop-blur-md">
            <p className="eyebrow text-aqua">Building since 1992</p>
            <p className="mt-3 text-pretty font-serif text-[1.125rem] leading-snug text-white">
              Steel, shotcrete, plaster, tile and deck — all set in the right order, to one standard.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
