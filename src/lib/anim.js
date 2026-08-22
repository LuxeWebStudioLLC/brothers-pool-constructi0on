import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

export const EASE = 'expo.out'

/** Default ScrollTrigger config for "reveal once, when it comes into view". */
export const enter = (el, extra = {}) => ({
  trigger: el,
  start: 'top 85%',
  once: true,
  ...extra,
})

export { gsap, ScrollTrigger, SplitText }
