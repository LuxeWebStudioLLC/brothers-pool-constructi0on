import Reveal from './Reveal'
import SplitHeading from './SplitHeading'

/**
 * Eyebrow + heading + optional lede. `tone` flips the type colours for the
 * dark sections so callers don't repeat colour classes everywhere.
 */
export default function SectionHead({
  eyebrow,
  title,
  lede,
  tone = 'light',
  align = 'left',
  className = '',
}) {
  const dark = tone === 'dark'
  const centered = align === 'center'

  return (
    <div className={[centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl', className].join(' ')}>
      {eyebrow && (
        <Reveal y={14} duration={0.9}>
          <p className={`eyebrow ${centered ? 'justify-center' : ''} ${dark ? 'text-aqua' : 'text-aqua'}`}>
            {eyebrow}
          </p>
        </Reveal>
      )}

      <SplitHeading
        className={`mt-5 fluid-h2 text-balance ${dark ? 'text-white' : 'text-deep'}`}
      >
        {title}
      </SplitHeading>

      {lede && (
        <Reveal y={22} delay={0.12}>
          <p
            className={`mt-6 max-w-2xl text-pretty font-sans text-[1.0625rem] leading-relaxed ${
              centered ? 'mx-auto' : ''
            } ${dark ? 'text-white/65' : 'text-graphite'}`}
          >
            {lede}
          </p>
        </Reveal>
      )}
    </div>
  )
}
