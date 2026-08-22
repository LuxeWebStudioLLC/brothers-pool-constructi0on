import { useRef, useEffect } from 'react'
import { gsap, enter } from '../lib/anim'
import { process } from '../lib/site'
import SectionHead from './SectionHead'
import { motionReady, useMotionGate } from '../lib/motion'

export default function Process() {
  const gate = useMotionGate()
  const root = useRef(null)

  useEffect(() => {
    if (!motionReady()) return
    const ctx = gsap.context(() => {
      // The rail fills as you read down the list.
      gsap.fromTo(
        '[data-rail-fill]',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-rail]',
            start: 'top 62%',
            end: 'bottom 72%',
            scrub: 0.6,
          },
        }
      )

      gsap.utils.toArray('[data-step]').forEach((step) => {
        gsap.from(step, {
          x: -26,
          autoAlpha: 0,
          duration: 1.05,
          ease: 'expo.out',
          scrollTrigger: enter(step, { start: 'top 84%' }),
        })
        // Node lights up when the step is reached.
        gsap.to(step.querySelector('[data-node]'), {
          backgroundColor: '#2FCFDC',
          borderColor: '#2FCFDC',
          color: '#05141C',
          scale: 1.18,
          duration: 0.5,
          ease: 'expo.out',
          scrollTrigger: { trigger: step, start: 'top 68%', once: true },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [gate])

  return (
    <section ref={root} id="process" className="caustics grain section relative overflow-hidden bg-ink">
      <div className="shell relative">
        <SectionHead
          align="center"
          tone="dark"
          eyebrow="How it goes"
          title="Six phases, and you know where you are in all of them"
          lede="A pool is a construction project on your property. Here is the order it happens in, so nothing about the next eight to fourteen weeks is a surprise."
        />

        <div data-rail className="relative mx-auto mt-16 max-w-3xl lg:mt-24">
          {/* Rail */}
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/12 lg:left-[19px]" aria-hidden="true">
            <span
              data-rail-fill
              className="block h-full w-full origin-top bg-gradient-to-b from-aqua-lit to-aqua"
            />
          </div>

          <ol className="space-y-11 lg:space-y-14">
            {process.map((p) => (
              <li key={p.n} data-step className="relative pl-14 lg:pl-20">
                <span
                  data-node
                  className="absolute left-0 top-1.5 flex h-[31px] w-[31px] items-center justify-center rounded-full border border-ember/45 bg-ink font-display text-[0.625rem] font-semibold tracking-[0.06em] text-ember lg:h-[39px] lg:w-[39px] lg:text-[0.6875rem]"
                >
                  {p.n}
                </span>
                <h3 className="fluid-h3 !text-[1.375rem] text-white lg:!text-[1.625rem]">
                  {p.title}
                </h3>
                <p className="mt-3.5 max-w-xl text-pretty font-sans text-[0.9375rem] leading-relaxed text-white/60 lg:text-base">
                  {p.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
