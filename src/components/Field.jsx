/** Floating-label text input / textarea / select used across the contact form. */
export default function Field({
  label,
  name,
  type = 'text',
  as = 'input',
  value,
  onChange,
  error,
  hint,
  options = [],
  rows = 5,
  required = false,
  className = '',
  ...rest
}) {
  const id = `f-${name}`
  const shared = {
    id,
    name,
    value,
    onChange,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${id}-err` : hint ? `${id}-hint` : undefined,
    className: `field ${error ? 'field-err' : ''} ${value ? 'field-filled' : ''}`,
  }

  return (
    <div className={className}>
      <div className="relative">
        {as === 'textarea' && (
          <textarea {...shared} rows={rows} placeholder={label} className={`${shared.className} resize-none !pt-6`} {...rest} />
        )}

        {as === 'select' && (
          <>
            <select {...shared} className={`${shared.className} appearance-none`} {...rest}>
              <option value="">Select an option</option>
              {options.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none absolute right-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/45"
              fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"
            >
              <path d="m6 9.5 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}

        {as === 'input' && (
          <>
            <input
              {...shared}
              type={type}
              placeholder={label}
              list={options.length ? `${id}-list` : undefined}
              {...rest}
            />
            {/* Suggestions, not a whitelist — anything typed is accepted. */}
            {options.length > 0 && (
              <datalist id={`${id}-list`}>
                {options.map((o) => (
                  <option key={o} value={o} />
                ))}
              </datalist>
            )}
          </>
        )}

        <label htmlFor={id} className="field-label">
          {label}
          {required && <span className="ml-1 text-aqua">*</span>}
        </label>
      </div>

      {error ? (
        <p id={`${id}-err`} className="mt-2 font-sans text-[0.75rem] text-[#F2A08C]">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-2 font-sans text-[0.75rem] text-white/35">{hint}</p>
      ) : null}
    </div>
  )
}
