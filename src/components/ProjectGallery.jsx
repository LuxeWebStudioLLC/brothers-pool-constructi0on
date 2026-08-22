import { useRef, useState, useEffect, useCallback } from 'react'
import { gsap } from '../lib/anim'
import { gallery } from '../lib/site'
import { Arrow, Plus } from './Icons'
import { motionReady } from '../lib/motion'

/**
 * The full archive, opened on demand. Kept out of the page by default because
 * twenty-plus photographs would bury everything below them — and laid out
 * horizontally so the reveal is a sideways sweep rather than another long
 * vertical scroll.
 *
 * Scrolling is native (`overflow-x` + snap), so trackpads, touch and keyboard
 * all work for free; the arrows and drag-to-pan are conveniences on top.
 */
export default function ProjectGallery() {
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const track = useRef(null)
  const region = useRef(null)

  // Scroll position → progress bar + arrow disabling
  const readScroll = useCallback(() => {
    const el = track.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setProgress(max > 0 ? el.scrollLeft / max : 0)
    setAtStart(el.scrollLeft < 8)
    setAtEnd(el.scrollLeft > max - 8)
  }, [])

  useEffect(() => {
    const el = track.current
    if (!el || !open) return
    readScroll()
    el.addEventListener('scroll', readScroll, { passive: true })
    window.addEventListener('resize', readScroll)
    return () => {
      el.removeEventListener('scroll', readScroll)
      window.removeEventListener('resize', readScroll)
    }
  }, [open, readScroll])

  // Cards sweep in from the right as the panel opens.
  useEffect(() => {
    if (!open || !motionReady() || !track.current) return
    const ctx = gsap.context(() => {
      gsap.from('[data-gal-card]', {
        x: 70,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.06,
        ease: 'expo.out',
        delay: 0.15,
      })
    }, region)
    return () => ctx.revert()
  }, [open])

  const step = (dir) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector('[data-gal-card]')
    const by = card ? card.offsetWidth + 20 : el.clientWidth * 0.8
    const target = el.scrollLeft + dir * by
    if (motionReady()) {
      gsap.to(el, { scrollLeft: target, duration: 0.7, ease: 'expo.out', overwrite: true })
    } else {
      el.scrollLeft = target
    }
  }

  // Click-and-drag panning, so a mouse can move it like a touchpad can.
  useEffect(() => {
    const el = track.current
    if (!el || !open) return
    let down = false
    let startX = 0
    let startLeft = 0
    const onDown = (e) => {
      if (e.pointerType === 'touch') return
      down = true
      startX = e.clientX
      startLeft = el.scrollLeft
      el.setPointerCapture?.(e.pointerId)
      el.style.cursor = 'grabbing'
    }
    const onMove = (e) => {
      if (!down) return
      el.scrollLeft = startLeft - (e.clientX - startX)
    }
    const onUp = () => {
      down = false
      el.style.cursor = ''
    }
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [open])

  return (
    <div ref={region} className="mt-12">
      {/* ── Toggle ─────────────────────────────────────────────────────── */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="project-archive"
          className="group inline-flex items-center gap-3.5 border border-stone bg-white px-6 py-4 transition-colors duration-500 hover:border-deep/30"
        >
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full border border-stone text-deep transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              open ? 'rotate-45 border-ember bg-ember text-white' : 'group-hover:border-ember group-hover:text-ember'
            }`}
          >
            <Plus size={14} />
          </span>
          <span className="font-display text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-deep">
            {open ? 'Close gallery' : 'View gallery'}
          </span>
        </button>
      </div>

      {/* ── Archive ────────────────────────────────────────────────────── */}
      <div
        id="project-archive"
        role="region"
        aria-label="Full project gallery"
        className="grid w-full min-w-0 overflow-hidden transition-[grid-template-rows,opacity] duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0 }}
      >
        <div className="min-h-0 min-w-0">
          <div className="w-full min-w-0 pt-12">
            {/* controls */}
            <div className="shell mb-6 flex items-center justify-between gap-6">
              <p className="font-sans text-[0.75rem] uppercase tracking-[0.2em] text-graphite/70">
                Drag, swipe or scroll sideways
              </p>
              <div className="flex items-center gap-2.5">
                {[-1, 1].map((dir) => (
                  <button
                    key={dir}
                    type="button"
                    onClick={() => step(dir)}
                    disabled={dir === -1 ? atStart : atEnd}
                    aria-label={dir === -1 ? 'Previous projects' : 'Next projects'}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-stone text-deep transition-all duration-400 hover:border-deep hover:bg-deep hover:text-white disabled:pointer-events-none disabled:opacity-25"
                  >
                    <Arrow size={16} className={dir === -1 ? 'rotate-180' : ''} />
                  </button>
                ))}
              </div>
            </div>

            {/* the rail — full bleed, with a shell-width lead-in */}
            <div
              ref={track}
              tabIndex={0}
              className="no-scrollbar flex w-full min-w-0 max-w-full snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 [scrollbar-width:none] focus:outline-none"
              style={{
                cursor: 'grab',
                // Visual lead-in aligned to the shell...
                paddingInline: 'max(1.5rem, calc((100vw - 1240px) / 2 + 2.5rem))',
                // ...and the matching scroll-padding, or snap would pull the
                // first card flush to the edge and swallow it.
                scrollPaddingInline: 'max(1.5rem, calc((100vw - 1240px) / 2 + 2.5rem))',
              }}
            >
              {gallery.map((g) => (
                <figure
                  key={g.img + g.title}
                  data-gal-card
                  className="group relative aspect-[4/3] w-[78vw] shrink-0 snap-start overflow-hidden bg-deep sm:w-[52vw] lg:w-[30rem]"
                >
                  <img
                    src={g.img}
                    alt={g.title}
                    loading="lazy"
                    draggable="false"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(5,20,28,0.32)_66%,rgba(5,20,28,0.9)_100%)]" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-6">
                    <p className="font-sans text-[0.6875rem] uppercase tracking-[0.2em] text-aqua-lit">
                      {g.meta}
                    </p>
                    <p className="mt-2 text-balance font-serif text-[1.0625rem] leading-snug text-white">
                      {g.title}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>

            {/* progress */}
            <div className="shell mt-7">
              <div className="h-px w-full bg-stone">
                <div
                  className="h-full origin-left bg-ember transition-[width] duration-200 ease-out"
                  style={{ width: `${Math.max(6, progress * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
