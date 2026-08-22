import { useRef, useEffect } from 'react'
import { gsap, enter } from '../lib/anim'
import { motionReady, useMotionGate } from '../lib/motion'

/**
 * Counts up to `value` the first time it scrolls into view. The suffix is a
 * separate span so it can carry its own colour — the numeral and its
 * punctuation are deliberately different weights of accent.
 */
export default function Counter({ value, suffix = '', className = '', suffixClassName = '' }) {
  const gate = useMotionGate()
  const wrap = useRef(null)
  const num = useRef(null)

  useEffect(() => {
    if (!motionReady()) {
      if (num.current) num.current.textContent = value.toLocaleString()
      return
    }
    const obj = { n: 0 }
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        n: value,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: enter(wrap.current, { start: 'top 88%' }),
        onUpdate: () => {
          // A hot reload can detach the node while the tween is still ticking.
          if (num.current) num.current.textContent = Math.round(obj.n).toLocaleString()
        },
      })
    }, wrap)
    return () => ctx.revert()
  }, [gate, value])

  return (
    <span ref={wrap} className={className}>
      <span ref={num}>0</span>
      {suffix && <span className={suffixClassName}>{suffix}</span>}
    </span>
  )
}
