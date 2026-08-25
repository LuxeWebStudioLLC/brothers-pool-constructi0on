import { company, studio } from '../lib/site'
import { Arrow } from './Icons'

const UPDATED = 'August 2026'

/**
 * Written to describe what this site actually does — audited, not boilerplate.
 * It sets no cookies, runs no analytics and loads no advertising trackers, so
 * the policy says exactly that rather than hedging with generic language.
 */
export default function PrivacyPage() {
  return (
    <main className="min-h-svh bg-sand">
      <div className="border-b border-stone bg-white">
        <div className="shell flex items-center justify-between gap-6 py-6">
          <a href="/" aria-label={`${company.name} — home`}>
            <img src="/img/logo.png" alt={company.name} className="h-7 w-auto" />
          </a>
          <a href="/" className="link-draw font-display text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-deep">
            Back to site <Arrow size={15} />
          </a>
        </div>
      </div>

      <article className="shell max-w-3xl py-20 lg:py-28">
        <p className="eyebrow text-aqua">Legal</p>
        <h1 className="mt-6 fluid-h1 text-balance text-deep">Privacy Policy</h1>
        <p className="mt-6 font-sans text-[0.875rem] text-graphite">Last updated {UPDATED}</p>

        <div className="mt-12 space-y-10">
          <Section title="Who this covers">
            <P>
              This policy explains what {company.name} does with information you give us through
              this website. If you would rather ask a person, call{' '}
              <A href={company.phoneHref}>{company.phone}</A> or email{' '}
              <A href={company.emailHref}>{company.email}</A>.
            </P>
          </Section>

          <Section title="Cookies and what is stored on your device">
            <P>
              We set no cookies, and we run no analytics, advertising or session-tracking software.
              We do not build a profile of you or follow you across other websites.
            </P>
            <P>
              One thing is saved locally: if you close the &ldquo;thinking about a pool?&rdquo;
              prompt, your browser remembers that for a week so it does not reappear on every visit.
              It is a single date stored on your own device, it is never sent to us, and clearing
              your browsing data removes it.
            </P>
            <P>
              The one thing loaded from outside our own server is the typefaces, served by Google
              Fonts. Google receives your IP address as part of delivering those files. Google Fonts
              does not set cookies.
            </P>
          </Section>

          <Section title="What we collect, and only when you send it">
            <P>
              We collect nothing from you simply for visiting. The only information we receive is
              what you choose to type into an enquiry form and submit:
            </P>
            <ul className="mt-4 space-y-2.5">
              {[
                'Your name, email address and phone number',
                'The town or ZIP code your property is in, and the address if you give it',
                'Which services you are interested in',
                'Your budget range and timeline, if you tell us',
                'Anything you write in the message field',
              ].map((li) => (
                <li key={li} className="flex gap-3 font-sans text-[0.9375rem] leading-relaxed text-graphite">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ember" aria-hidden="true" />
                  {li}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="What we do with it">
            <P>
              We use it to reply to you and to arrange a visit to the property. That is the whole
              purpose. We do not sell your details, we do not share them with advertisers or lead
              brokers, and we do not add you to a marketing list you did not ask for.
            </P>
            <P>
              Enquiries are delivered to us by FormSubmit (formsubmit.co), a third-party form
              service that passes the message to our email inbox. Your details pass through their
              systems on the way to us and are handled under their own privacy terms.
            </P>
          </Section>

          <Section title="How long we keep it">
            <P>
              We keep enquiries for as long as we need them to respond and, if you become a
              customer, as part of the ordinary records of the job. Ask us at any time and we will
              delete what we hold.
            </P>
          </Section>

          <Section title="Your choices">
            <P>
              Email <A href={company.emailHref}>{company.email}</A> to ask what we hold about you,
              to correct it, or to have it deleted. You can also simply ask us to stop contacting
              you and we will.
            </P>
          </Section>

          <Section title="Children">
            <P>
              This site is aimed at property owners and is not directed at children. We do not
              knowingly collect information from anyone under 13.
            </P>
          </Section>

          <Section title="Changes">
            <P>
              If we start using anything that tracks visitors — analytics or advertising tools, for
              example — we will update this page before turning it on, and add a consent notice if
              one is required.
            </P>
          </Section>

          <Section title="Website">
            <P>
              This site was designed and built by {studio.name}. Technical questions about the site
              itself can go to <A href={`mailto:${studio.email}`}>{studio.email}</A>.
            </P>
          </Section>
        </div>

        <div className="mt-16 border-t border-stone pt-10">
          <a href="/" className="btn btn-ink">
            <span>
              Back to {company.short}
              <Arrow size={16} />
            </span>
          </a>
        </div>
      </article>
    </main>
  )
}

const Section = ({ title, children }) => (
  <section>
    <h2 className="font-serif text-[1.375rem] text-deep lg:text-[1.5rem]">{title}</h2>
    <div className="mt-4 space-y-4">{children}</div>
  </section>
)

const P = ({ children }) => (
  <p className="text-pretty font-sans text-[0.9375rem] leading-relaxed text-graphite">{children}</p>
)

const A = ({ href, children }) => (
  <a href={href} className="link-draw font-medium text-deep">
    {children}
  </a>
)
