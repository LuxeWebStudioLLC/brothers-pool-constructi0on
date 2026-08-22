import { testimonials } from '../lib/site'
import SectionHead from './SectionHead'
import Reveal from './Reveal'
import { Quote } from './Icons'

/**
 * Sticky heading on the left, reviews stacked on the right — the same offset
 * composition the differentiators used, so the page rhythm is unchanged.
 *
 * Add or swap reviews in `testimonials` in site.js; nothing here needs editing.
 */
export default function Testimonials() {
  return (
    <section id="testimonials" className="section bg-sand">
      <div className="shell grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHead
            eyebrow="In their words"
            title="Why coastal homeowners keep calling us back"
            lede="No sales theatre, no pressure, no vanishing crew. Here is what people say once the water is in."
          />
        </div>

        <div className="border-t border-stone lg:mt-4">
          {testimonials.map((t, i) => (
            <Reveal
              as="figure"
              key={t.author}
              y={30}
              delay={i * 0.04}
              className="border-b border-stone py-9 lg:py-10"
            >
              <Quote size={26} className="text-ember/45" />
              <blockquote className="mt-5 max-w-xl text-pretty font-serif text-[1.25rem] leading-[1.45] text-deep lg:text-[1.375rem]">
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 flex items-baseline gap-3">
                <span className="font-display text-[0.8125rem] font-semibold text-deep">
                  {t.author}
                </span>
                <span className="font-sans text-[0.6875rem] uppercase tracking-[0.18em] text-graphite/70">
                  {t.meta}
                </span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
