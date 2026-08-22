const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const Svg = ({ children, size = 20, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...base} {...rest}>
    {children}
  </svg>
)

export const Phone = (p) => (
  <Svg {...p}>
    <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z" />
  </Svg>
)

export const Mail = (p) => (
  <Svg {...p}>
    <rect x="2.75" y="5" width="18.5" height="14" rx="2" />
    <path d="m3.5 6.5 8.5 6 8.5-6" />
  </Svg>
)

export const Pin = (p) => (
  <Svg {...p}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </Svg>
)

export const Arrow = (p) => (
  <Svg {...p}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </Svg>
)

export const ArrowDown = (p) => (
  <Svg {...p}>
    <path d="M12 4v15" />
    <path d="m6 13 6 6 6-6" />
  </Svg>
)

export const Calendar = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 10h17M8 3.5V6.5M16 3.5V6.5" />
  </Svg>
)

export const Trowel = (p) => (
  <Svg {...p}>
    <path d="M14 3.5 20.5 10 14 16.5 7.5 10Z" />
    <path d="M10.75 13.25 4.5 19.5" />
  </Svg>
)

export const Shield = (p) => (
  <Svg {...p}>
    <path d="M12 3.25 19.5 6v6c0 4.4-3.1 7.6-7.5 8.75C7.6 19.6 4.5 16.4 4.5 12V6Z" />
    <path d="m9 11.75 2.25 2.25L15.25 10" />
  </Svg>
)

export const Plus = (p) => (
  <Svg {...p}>
    <path d="M12 5.5v13M5.5 12h13" />
  </Svg>
)

export const Check = (p) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
)

export const Quote = ({ size = 34, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...rest}>
    <path d="M9.6 5.4c-3 1.5-4.8 4-4.8 7.5v5.7h6.3v-6.3H8.4c0-2 .9-3.3 2.7-4.2Zm9.6 0c-3 1.5-4.8 4-4.8 7.5v5.7h6.3v-6.3H18c0-2 .9-3.3 2.7-4.2Z" />
  </svg>
)

export const Facebook = ({ size = 18, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...rest}>
    <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6c-.3-.04-1.35-.13-2.6-.13-2.55 0-4.3 1.55-4.3 4.42V9.9H7.1V13h2.7v8Z" />
  </svg>
)

export const Linkedin = ({ size = 18, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...rest}>
    <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9.5h4v11.5H3Zm7 0h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.1c0-1.22-.02-2.8-1.7-2.8-1.7 0-1.96 1.33-1.96 2.7V21h-4Z" />
  </svg>
)

export const PoolIcon = (p) => (
  <Svg {...p}>
    <path d="M3 15.5c1.6 0 1.6 1.4 3.2 1.4s1.6-1.4 3.2-1.4 1.6 1.4 3.2 1.4 1.6-1.4 3.2-1.4 1.6 1.4 3.2 1.4" />
    <path d="M3 19.5c1.6 0 1.6 1.4 3.2 1.4s1.6-1.4 3.2-1.4 1.6 1.4 3.2 1.4 1.6-1.4 3.2-1.4 1.6 1.4 3.2 1.4" />
    <path d="M8 13V4.5a2 2 0 0 1 4 0M16 13V4.5a2 2 0 0 1 4 0M8 8.25h4M16 8.25h4" />
  </Svg>
)

export const Renew = (p) => (
  <Svg {...p}>
    <path d="M20 11.5a8 8 0 0 0-13.7-5.2L3.5 9" />
    <path d="M4 12.5a8 8 0 0 0 13.7 5.2L20.5 15" />
    <path d="M3.5 4.5V9H8M20.5 19.5V15H16" />
  </Svg>
)

export const Paver = (p) => (
  <Svg {...p}>
    <rect x="3" y="4" width="8" height="6" rx="0.5" />
    <rect x="13" y="4" width="8" height="6" rx="0.5" />
    <rect x="3" y="14" width="8" height="6" rx="0.5" />
    <rect x="13" y="14" width="8" height="6" rx="0.5" />
  </Svg>
)

export const Flame = (p) => (
  <Svg {...p}>
    <path d="M12 21c3.3 0 5.5-2.2 5.5-5.2 0-4-3.5-5.6-3.5-9.3-2.4 1.3-3.3 3.4-3.3 5 0 1.4-.9 2.2-1.9 2.2-1.1 0-1.8-.9-1.8-2.3-.9 1.2-1.5 2.7-1.5 4.4C5.5 18.8 8.7 21 12 21Z" />
  </Svg>
)

export const Screen = (p) => (
  <Svg {...p}>
    <path d="M3 20V10.5L12 4l9 6.5V20" />
    <path d="M3 20h18" />
    <path d="M7.5 20V12M12 20V9.5M16.5 20V12" />
    <path d="M3.9 14h16.2" />
  </Svg>
)

export const iconMap = { calendar: Calendar, trowel: Trowel, shield: Shield }

export const serviceIcons = {
  construction: PoolIcon,
  renovation: Renew,
  hardscape: Paver,
  outdoor: Flame,
  screen: Screen,
}
