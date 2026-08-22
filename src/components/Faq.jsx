import { useRef, useState } from 'react'
import { faqs } from '../lib/site'
import SectionHead from './SectionHead'
import Reveal from './Reveal'
import { Plus } from './Icons'

function Item({ q, a, open, onToggle, index }) {
  const body = useRef(null)

  return (
    <div className="border-b border-stone">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`faq-panel-${index}`}
          className="group flex w-full items-start justify-between gap-6 py-6 text-left lg:py-7"
        >
          <span
            className={`text-balance font-serif text-[1.1875rem] leading-snug transition-colors duration-400 lg:text-[1.3125rem] ${
              open ? 'text-aqua' : 'text-deep group-hover:text-aqua'
            }`}
          >
            {q}
          </span>
          <span
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              open
                ? 'rotate-45 border-aqua bg-aqua text-ink'
                : 'border-stone text-deep group-hover:border-aqua group-hover:text-aqua'
            }`}
          >
            <Plus size={15} />
          </span>
        </button>
      </h3>

      <div
        id={`faq-panel-${index}`}
        ref={body}
        role="region"
        className="grid overflow-hidden transition-[grid-template-rows,opacity] duration-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0 }}
      >
        <div className="min-h-0">
          <p className="max-w-2xl text-pretty pb-7 pr-12 font-sans text-[0.9375rem] leading-relaxed text-graphite">
            {a}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="section bg-white">
      <div className="shell grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead
            eyebrow="Good questions"
            title="Answers before you pick up the phone"
            lede="If yours is not here, ask us directly. We would rather answer it now than after a contract is signed."
          />
        </div>

        <Reveal y={26}>
          <div className="border-t border-stone">
            {faqs.map((f, i) => (
              <Item
                key={f.q}
                index={i}
                q={f.q}
                a={f.a}
                open={open === i}
                onToggle={() => setOpen(open === i ? -1 : i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
