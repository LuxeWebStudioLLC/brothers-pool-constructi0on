import { useRef, useEffect } from 'react'
import { gsap, enter } from '../lib/anim'
import { motionReady, useMotionGate } from '../lib/motion'

/**
 * Rises its children into place as they scroll in. `stagger` treats direct
 * children as a sequence instead of animating the wrapper as one block.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  className = '',
  y = 34,
  delay = 0,
  duration = 1.1,
  stagger = 0,
  start = 'top 85%',
  ...rest
}) {
  const gate = useMotionGate()
  const ref = useRef(null)

  useEffect(() => {
    if (!motionReady()) return
    const el = ref.current
    const targets = stagger ? Array.from(el.children) : el
    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y,
        autoAlpha: 0,
        duration,
        delay,
        stagger,
        ease: 'expo.out',
        scrollTrigger: enter(el, { start }),
      })
    }, el)
    return () => ctx.revert()
  }, [gate, y, delay, duration, stagger, start])

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}
