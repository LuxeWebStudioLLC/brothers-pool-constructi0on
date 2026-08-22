import { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger } from '../lib/anim'
import { projects } from '../lib/site'
import SectionHead from './SectionHead'
import Reveal from './Reveal'
import { Arrow } from './Icons'
import ProjectGallery from './ProjectGallery'
import { motionReady, useMotionGate } from '../lib/motion'

export default function Projects() {
  const gate = useMotionGate()
  const grid = useRef(null)

  useEffect(() => {
    if (!motionReady()) return

    const ctx = gsap.context(() => {
      // Tiles unmask upward while the photo inside settles back from a slight
      // overscale — the reveal reads as the image arriving, not the box fading.
      ScrollTrigger.batch('[data-tile]', {
        start: 'top 92%',
        once: true,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { clipPath: 'inset(0% 0% 100% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 1.35,
              stagger: 0.11,
              ease: 'expo.out',
            }
          )
          gsap.fromTo(
            batch.map((t) => t.querySelector('img')),
            { scale: 1.16 },
            { scale: 1, duration: 1.7, stagger: 0.11, ease: 'expo.out' }
          )
        },
      })

      // Image drift, every size. Transform-only, so the compositor handles it.
      const tweens = gsap.utils.toArray('[data-tile]').map((tile) =>
        gsap.fromTo(
          tile.querySelector('img'),
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: 'none',
            scrollTrigger: { trigger: tile, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        )
      )

      return () => tweens.forEach((t) => t.scrollTrigger?.kill())
    }, grid)

    return () => ctx.revert()
  }, [gate])

  return (
    <section id="work" className="section bg-sand">
      <div className="shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead
            eyebrow="Selected work"
            title="Pools we have put in the ground"
            lede="A cross-section of new construction, renovation and outdoor living across the Grand Strand."
          />
          <Reveal className="shrink-0" y={18} delay={0.2}>
            <a href="#contact" className="btn btn-ink">
              <span>
                Discuss your project
                <Arrow size={16} />
              </span>
            </a>
          </Reveal>
        </div>

        <div ref={grid} className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-18 lg:gap-6">
          {projects.map((p) => (
            /* The figure IS the aspect box, so the caption can never fall
               outside the image the way a stretched grid item would. */
            <figure
              key={p.title}
              data-tile
              className="group relative aspect-[4/5] self-start overflow-hidden bg-deep sm:aspect-[4/3]"
            >
              <img
                src={p.img}
                alt={p.title}
                loading="lazy"
                style={{ objectPosition: p.pos, willChange: 'transform' }}
                className="absolute inset-0 h-[110%] w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
              />

              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgba(5,20,28,0.35)_62%,rgba(5,20,28,0.9)_100%)]" />

              <figcaption className="absolute inset-x-0 bottom-0 p-6 lg:p-7">
                {/* Always visible: hover-only captions simply never appear on a
                    phone, leaving half the label permanently hidden. */}
                <p className="font-sans text-[0.6875rem] uppercase tracking-[0.2em] text-aqua-lit">
                  {p.meta}
                </p>
                <p className="mt-2 text-balance font-serif text-[1.125rem] leading-snug text-white">
                  {p.title}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

      </div>

      {/* Outside the shell so the rail can run edge to edge. */}
      <ProjectGallery />

      <div className="shell">
        <Reveal className="mt-12 text-center" y={16}>
          <p className="font-sans text-[0.8125rem] text-graphite">
            Building on the Grand Strand and considering a pool?{' '}
            <a href="#contact" className="link-draw font-medium text-deep">
              Tell us about the property
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
