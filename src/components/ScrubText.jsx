import { useRef, useEffect } from 'react'
import { gsap, SplitText } from '../lib/anim'
import { motionReady, useMotionGate } from '../lib/motion'

/**
 * A statement that resolves word by word as it crosses the viewport. Used once,
 * on the line that matters most — the effect stops feeling expensive the second
 * time a visitor meets it.
 */
export default function ScrubText({ children, as: Tag = 'p', className = '', dim = 0.16 }) {
  const gate = useMotionGate()
  const ref = useRef(null)

  useEffect(() => {
    if (!motionReady()) return
    const el = ref.current
    let split
    let ctx

    const run = () => {
      ctx = gsap.context(() => {
        split = SplitText.create(el, { type: 'words' })
        gsap.fromTo(
          split.words,
          { opacity: dim },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.5,
            scrollTrigger: {
              trigger: el,
              start: 'top 82%',
              end: 'bottom 58%',
              scrub: 0.6,
            },
          }
        )
      }, el)
    }

    document.fonts?.ready.then(run) ?? run()
    return () => {
      ctx?.revert()
      split?.revert()
    }
  }, [gate, dim])

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
