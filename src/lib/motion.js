import { useEffect, useState } from 'react'

/**
 * Entrance animations are only safe to set up when the browser will actually
 * give us frames. A page loaded in a background tab gets no requestAnimationFrame,
 * so a `gsap.from()` would apply its hidden start state and sit there — leaving
 * the visitor with a blank page when they finally switch to it.
 *
 * This gate reports whether motion should run at all (respecting reduced-motion),
 * and notifies subscribers if a hidden document later becomes visible so the
 * animations can be wired up at that point instead.
 */

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

let visible = typeof document === 'undefined' ? false : document.visibilityState === 'visible'
const subscribers = new Set()

if (typeof document !== 'undefined' && !visible) {
  const onChange = () => {
    if (document.visibilityState !== 'visible') return
    visible = true
    document.removeEventListener('visibilitychange', onChange)
    subscribers.forEach((fn) => fn())
    subscribers.clear()
  }
  document.addEventListener('visibilitychange', onChange)
}

/** True when entrance animations should be created. */
export const motionReady = () => visible && !prefersReduced()

/**
 * Returns a value that changes once a hidden document becomes visible. Drop it
 * into an effect's dependency list so the effect re-runs and animates then.
 */
export function useMotionGate() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (visible) return
    const fn = () => setTick((t) => t + 1)
    subscribers.add(fn)
    return () => subscribers.delete(fn)
  }, [])

  return tick
}
