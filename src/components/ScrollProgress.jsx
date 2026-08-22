import { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger } from '../lib/anim'
import { motionReady, useMotionGate } from '../lib/motion'

/**
 * 1px read-progress hairline pinned under the nav. Scrubbed rather than
 * transitioned so it tracks the scrollbar exactly, including flicks.
 */
export default function ScrollProgress() {
  const gate = useMotionGate()
  const bar = useRef(null)

  useEffect(() => {
    if (!motionReady()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bar.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { start: 0, end: () => ScrollTrigger.maxScroll(window), scrub: 0.25 },
        }
      )
    })
    return () => ctx.revert()
  }, [gate])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-px" aria-hidden="true">
      <span
        ref={bar}
        className="block h-full w-full origin-left scale-x-0 bg-[linear-gradient(90deg,var(--color-aqua)_0%,var(--color-aqua-lit)_55%,var(--color-ember)_100%)]"
        style={{ willChange: 'transform' }}
      />
    </div>
  )
}
