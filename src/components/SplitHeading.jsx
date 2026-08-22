import { useRef, useEffect } from 'react'
import { gsap, SplitText, enter } from '../lib/anim'
import { motionReady, useMotionGate } from '../lib/motion'

/**
 * Masked line-by-line heading reveal. Waits for fonts so the split happens
 * against final metrics rather than the fallback face.
 */
export default function SplitHeading({
  children,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  start = 'top 85%',
  ...rest
}) {
  const gate = useMotionGate()
  const ref = useRef(null)

  useEffect(() => {
    if (!motionReady()) return
    const el = ref.current
    let split
    let ctx

    const run = () => {
      ctx = gsap.context(() => {
        split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' })
        gsap.from(split.lines, {
          yPercent: 115,
          duration: 1.15,
          delay,
          stagger: 0.09,
          ease: 'expo.out',
          scrollTrigger: enter(el, { start }),
        })
      }, el)
    }

    document.fonts?.ready.then(run) ?? run()

    return () => {
      ctx?.revert()
      split?.revert()
    }
  }, [gate, delay, start])

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}
