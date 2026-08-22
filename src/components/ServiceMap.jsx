import { useRef, useEffect } from 'react'
import { gsap } from '../lib/anim'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { company } from '../lib/site'
import { motionReady, useMotionGate } from '../lib/motion'

gsap.registerPlugin(DrawSVGPlugin)

/**
 * Self-drawn map of the Grand Strand — no map service, no tiles, no tracking.
 * Geography is projected from real coordinates (equirectangular, latitude-
 * corrected) so the 50-mile ring and the town positions are honest.
 */

// Projected from lon/lat: x=(lon+80.1)/2.4*435, y=(34.8-lat)/2.2*480
const TOWNS = [
  { x: 219, y: 242, label: 'Myrtle Beach', anchor: 'start', dx: 8, dy: 4 },
  { x: 257, y: 214, label: 'N. Myrtle Beach', anchor: 'start', dx: 8, dy: 8 },
  { x: 270, y: 203, label: 'Little River', anchor: 'end', dx: -8, dy: -4 },
  { x: 277, y: 198, label: 'Calabash, NC', anchor: 'start', dx: 8, dy: -4 },
  { x: 288, y: 201, label: '', anchor: 'start', dx: 0, dy: 0 }, // Sunset Beach, dot only
  { x: 219, y: 161, label: 'Loris', anchor: 'start', dx: 8, dy: -3 },
  { x: 163, y: 177, label: 'Aynor', anchor: 'end', dx: -8, dy: -3 },
  { x: 153, y: 130, label: 'Mullins', anchor: 'end', dx: -8, dy: -3 },
  { x: 127, y: 135, label: 'Marion', anchor: 'end', dx: -8, dy: 10 },
  { x: 63, y: 203, label: 'Lake City', anchor: 'start', dx: 8, dy: -3 },
  { x: 205, y: 260, label: 'Surfside Beach', anchor: 'start', dx: 8, dy: 6 },
  { x: 194, y: 273, label: 'Murrells Inlet', anchor: 'start', dx: 8, dy: 8 },
  { x: 178, y: 299, label: 'Pawleys Island', anchor: 'end', dx: -8, dy: 4 },
  { x: 149, y: 310, label: 'Georgetown', anchor: 'end', dx: -8, dy: 8 },
]

const COAST =
  'M 8 468 C 24 452 60 436 91 425 C 118 415 128 404 134 393 C 148 366 160 340 168 323 ' +
  'C 173 312 177 306 181 301 C 189 291 197 286 203 280 C 206 274 206 267 207 262 ' +
  'C 211 254 218 249 225 244 C 238 234 250 224 263 216 C 270 211 277 209 283 207 ' +
  'C 287 205 291 204 295 203 C 301 202 307 200 313 199 C 320 197 327 195 335 194 C 368 190 402 187 435 185'

const HOME = { x: 190, y: 209, r: 158, label: 'Conway' } // r = 50 mi at this projection

export default function ServiceMap({ className = '' }) {
  const gate = useMotionGate()
  const root = useRef(null)

  useEffect(() => {
    if (!motionReady()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
      })
      tl.from('[data-map-coast]', { drawSVG: '0%', duration: 1.6, ease: 'power2.inOut' })
        .from('[data-map-ocean]', { autoAlpha: 0, duration: 1.2, ease: 'none' }, 0.2)
        .from('[data-map-ring]', {
          scale: 0.4, autoAlpha: 0, duration: 1.3,
          svgOrigin: `${HOME.x} ${HOME.y}`,
        }, 0.55)
        .from('[data-map-fill]', { autoAlpha: 0, duration: 1.4, ease: 'none' }, 0.7)
        .from('[data-map-home]', { scale: 0, duration: 0.8, svgOrigin: `${HOME.x} ${HOME.y}` }, 0.8)
        .from('[data-map-town]', {
          scale: 0, duration: 0.7, stagger: 0.045,
          transformOrigin: 'center', transformBox: 'fill-box',
        }, 0.95)
        .from('[data-map-label]', { autoAlpha: 0, duration: 0.9, stagger: 0.03 }, 1.15)
        .from('[data-map-meta]', { autoAlpha: 0, duration: 1 }, 1.4)

      // quiet locator pulse on home — small element, cheap to run
      gsap.fromTo(
        '[data-map-pulse]',
        { scale: 1, autoAlpha: 0.55 },
        {
          scale: 2.4, autoAlpha: 0, duration: 2.6, repeat: -1, ease: 'power1.out',
          svgOrigin: `${HOME.x} ${HOME.y}`,
          scrollTrigger: { trigger: root.current, start: 'top 80%' },
        }
      )
    }, root)
    return () => ctx.revert()
  }, [gate])

  return (
    <div
      ref={root}
      className={`overflow-hidden border border-white/12 bg-white/[0.02] ${className}`}
    >
      <div className="flex items-baseline justify-between gap-4 border-b border-white/10 px-5 py-4">
        <span className="font-sans text-[0.6875rem] uppercase tracking-[0.22em] text-white/45">
          Where we work
        </span>
        <span className="font-serif text-[0.9375rem] italic text-ember">
          {company.serviceRadiusMiles}-mile radius
        </span>
      </div>

      <svg
        viewBox="0 0 435 480"
        role="img"
        aria-label={`Map showing a ${company.serviceRadiusMiles}-mile service radius centred on ${HOME.label}, South Carolina`}
        className="block w-full"
      >
        <defs>
          <radialGradient id="radius-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2FCFDC" stopOpacity="0.1" />
            <stop offset="78%" stopColor="#2FCFDC" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#2FCFDC" stopOpacity="0" />
          </radialGradient>
          <clipPath id="map-frame"><rect x="0" y="0" width="435" height="480" /></clipPath>
        </defs>

        <g clipPath="url(#map-frame)">
          {/* ocean */}
          <path
            data-map-ocean
            d={`${COAST} L 435 480 L 8 480 Z`}
            fill="rgba(47,207,220,0.05)"
          />

          {/* NC / SC line */}
          <line
            data-map-meta
            x1="283" y1="207" x2="170" y2="60"
            stroke="rgba(255,255,255,0.14)" strokeWidth="1" strokeDasharray="2 5"
          />
          <text data-map-meta x="262" y="118" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="var(--font-sans)" letterSpacing="2">NC</text>
          <text data-map-meta x="178" y="152" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="var(--font-sans)" letterSpacing="2">SC</text>

          {/* 50-mile ring */}
          <circle data-map-fill cx={HOME.x} cy={HOME.y} r={HOME.r} fill="url(#radius-fill)" />
          <circle
            data-map-ring
            cx={HOME.x} cy={HOME.y} r={HOME.r}
            fill="none" stroke="#F2793C" strokeOpacity="0.55" strokeWidth="1.25"
          />
          <text
            data-map-meta
            x="338" y="118" textAnchor="middle"
            fill="#F2793C" fontSize="9.5" fontFamily="var(--font-sans)" letterSpacing="2.5"
          >
            50 MILES
          </text>

          {/* coastline */}
          <path
            data-map-coast
            d={COAST}
            fill="none" stroke="rgba(90,234,242,0.5)" strokeWidth="1.5" strokeLinecap="round"
          />
          <text
            data-map-meta
            x="330" y="330" textAnchor="middle"
            fill="rgba(255,255,255,0.22)" fontSize="10" fontFamily="var(--font-sans)" letterSpacing="4"
          >
            ATLANTIC OCEAN
          </text>

          {/* towns */}
          {TOWNS.map((t) => (
            <g key={`${t.x}-${t.y}`}>
              <circle data-map-town cx={t.x} cy={t.y} r="2.5" fill="rgba(255,255,255,0.65)" />
              {t.label && (
                <text
                  data-map-label
                  x={t.x + t.dx} y={t.y + t.dy}
                  textAnchor={t.anchor}
                  fill="rgba(255,255,255,0.55)" fontSize="9.5" fontFamily="var(--font-sans)"
                >
                  {t.label}
                </text>
              )}
            </g>
          ))}

          {/* home marker */}
          <circle data-map-pulse cx={HOME.x} cy={HOME.y} r="7" fill="none" stroke="#F2793C" strokeWidth="1" />
          <g data-map-home>
            <circle cx={HOME.x} cy={HOME.y} r="7" fill="none" stroke="#F2793C" strokeWidth="1.25" />
            <circle cx={HOME.x} cy={HOME.y} r="3" fill="#F2793C" />
          </g>
          <text
            data-map-label
            x={HOME.x - 13} y={HOME.y - 2} textAnchor="end"
            fill="#fff" fontSize="11" fontWeight="600" fontFamily="var(--font-sans)"
          >
            {HOME.label}
          </text>
        </g>
      </svg>

      <p className="border-t border-white/10 px-5 py-4 font-sans text-[0.75rem] leading-relaxed text-white/40">
        Centred on {HOME.label} — every town shown sits inside the radius, from the coast to well
        inland, and just over the North Carolina line counts too.
      </p>
    </div>
  )
}
