import { useRef } from 'react'
import { budgetRange } from '../lib/site'

/**
 * Budget as a slider rather than a dropdown.
 *
 * It stays deliberately "unset" until the visitor actually moves it — a slider
 * always holds a value, and defaulting to one would attach a budget to every
 * enquiry whether or not they chose it, which is worse than no answer.
 */
export default function BudgetSlider({ value, touched, onChange, className = 'sm:col-span-2' }) {
  const { min, max, step } = budgetRange
  const ref = useRef(null)

  const pct = ((value - min) / (max - min)) * 100
  const label = !touched
    ? 'Drag to set a range'
    : value >= max
      ? `$${max},000+`
      : `$${value},000`

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-sans text-[0.75rem] uppercase tracking-[0.18em] text-white/45">
          Budget range{' '}
          <span className="normal-case tracking-normal text-white/30">(optional)</span>
        </span>
        <span
          className={`font-serif text-[1.125rem] transition-colors duration-300 ${
            touched ? 'text-aqua-lit' : 'text-white/35'
          }`}
        >
          {label}
        </span>
      </div>

      <div className="relative mt-5">
        {/* filled portion, drawn under the native track */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-gradient-to-r from-aqua to-aqua-lit transition-[width] duration-150"
          style={{ width: touched ? `${pct}%` : '0%' }}
        />
        <input
          ref={ref}
          type="range"
          className="range relative"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label="Budget range in US dollars"
          aria-valuetext={touched ? label : 'Not set'}
        />
      </div>

      <div className="mt-3 flex justify-between font-sans text-[0.6875rem] text-white/30">
        <span>${min},000</span>
        <span>${max},000+</span>
      </div>
    </div>
  )
}
