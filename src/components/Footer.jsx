import { company, nav, services } from '../lib/site'
import Reveal from './Reveal'
import StudioCredit from './StudioCredit'
import { Phone, Mail, Pin, Facebook, Arrow } from './Icons'

const secondary = [
  { label: 'Gallery', href: '#work' },
  { label: 'Financing', href: '#contact' },
  { label: 'Employment', href: '#contact' },
  { label: 'Subcontractors', href: '#contact' },
]

export default function Footer() {
  return (
    <footer className="caustics relative overflow-hidden border-t border-hairline bg-ink">
      <div className="shell relative">
        {/* CTA band */}
        <Reveal
          className="flex flex-col items-start justify-between gap-8 border-b border-white/8 py-16 lg:flex-row lg:items-center lg:py-20"
          y={26}
        >
          <div>
            <p className="eyebrow text-aqua">Ready when you are</p>
            <p className="mt-5 max-w-xl text-balance font-serif text-[1.875rem] font-medium leading-[1.2] tracking-[-0.015em] text-white lg:text-[2.5rem]">
              Let&apos;s walk the property and envision its potential.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a href={company.phoneHref} className="btn btn-outline">
              <span>
                <Phone size={15} />
                {company.phone}
              </span>
            </a>
            <a href="#contact" className="btn btn-white">
              <span>
                Request a consultation
                <Arrow size={16} />
              </span>
            </a>
          </div>
        </Reveal>

        {/* Columns */}
        <div className="grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-10">
          <div>
            <img src="/img/logo.png" alt={company.name} className="h-8 w-auto" />
            <p className="mt-6 max-w-xs text-pretty font-sans text-[0.875rem] leading-relaxed text-white/45">
              Custom shotcrete pool construction, renovation, hardscapes and outdoor living across
              coastal South Carolina. Family run since {company.founded}.
            </p>
            <div className="mt-7 flex items-center gap-3">
              {[{ href: company.facebook, Icon: Facebook, label: 'Facebook' }].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white/55 transition-all duration-500 hover:border-aqua hover:bg-aqua hover:text-ink"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Navigate" links={nav} />
          <FooterCol
            title="Services"
            links={services.slice(0, 6).map((s) => ({ label: s.title, href: '#services' }))}
          />

          <div>
            <h4 className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-white/35">
              Get in touch
            </h4>
            <ul className="mt-6 space-y-4">
              <li>
                <a href={company.phoneHref} className="group flex items-start gap-3">
                  <Phone size={15} className="mt-0.5 shrink-0 text-aqua" />
                  <span className="font-display text-[0.9375rem] font-medium text-white/85 transition-colors group-hover:text-white">
                    {company.phone}
                  </span>
                </a>
              </li>
              <li>
                <a href={company.emailHref} className="group flex items-start gap-3">
                  <Mail size={15} className="mt-0.5 shrink-0 text-aqua" />
                  <span className="font-sans text-[0.8125rem] leading-snug text-white/60 transition-colors [overflow-wrap:anywhere] group-hover:text-white">
                    {company.email}
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Pin size={15} className="mt-0.5 shrink-0 text-aqua" />
                <span className="font-sans text-[0.875rem] leading-relaxed text-white/60">
                  {company.serviceRadius}
                </span>
              </li>
            </ul>

            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/8 pt-6">
              {secondary.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="link-draw font-sans text-[0.8125rem] text-white/45 hover:text-white/80">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/8 py-8 sm:flex-row">
          <p className="font-sans text-[0.75rem] text-white/30">
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="/privacy" className="link-draw font-sans text-[0.75rem] text-white/30 hover:text-white/60">
              Privacy Policy
            </a>
            <p className="font-sans text-[0.75rem] text-white/30">
              Licensed &amp; insured · South Carolina &amp; Georgia
            </p>
          </div>
        </div>
      </div>

      <StudioCredit />
    </footer>
  )
}

const FooterCol = ({ title, links }) => (
  <div>
    <h4 className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-white/35">
      {title}
    </h4>
    <ul className="mt-6 space-y-3.5">
      {links.map((l) => (
        <li key={l.label}>
          <a href={l.href} className="link-draw font-sans text-[0.875rem] text-white/60 hover:text-white">
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
)
