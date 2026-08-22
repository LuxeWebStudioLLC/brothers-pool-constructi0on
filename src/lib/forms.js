import { company, studio } from './site'

/**
 * Where enquiries go. Set VITE_FORM_ENDPOINT in a .env file to any handler that
 * accepts a JSON POST (Formspree, Basin, a Netlify function, your own API).
 * Until that exists the submit still succeeds locally and the payload is logged,
 * so the UI can be reviewed end to end without a backend.
 */
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || ''

/**
 * Design-review escape hatch. With no endpoint configured the forms fail by
 * default; set VITE_FORM_SIMULATE=true to preview the success states instead.
 */
const SIMULATE = import.meta.env.VITE_FORM_SIMULATE === 'true'

/** Inbox that client enquiries land in. Falls back to the address on the site. */
const LEADS_EMAIL = import.meta.env.VITE_LEADS_EMAIL || company.email

/**
 * Extra recipients copied on every enquiry.
 *
 * FormSubmit only requires the address in the endpoint URL to be activated —
 * anyone on `_cc` receives the mail without confirming anything. That means
 * enquiries reach the business immediately instead of waiting on someone else
 * to click a link in their inbox.
 */
const LEADS_CC = import.meta.env.VITE_LEADS_CC || ''

/**
 * A 200 is not proof of delivery. FormSubmit answers 200 with
 * `{"success":"false"}` when a form is unactivated, and other services have
 * their own soft failures — so the body is inspected too. Anything short of a
 * real send throws, which surfaces the "call us instead" message rather than a
 * thank-you the enquiry never earned.
 */
/**
 * A form service that stops responding must not leave the visitor staring at
 * "Sending…" forever. Anything slower than this is treated as a failure, which
 * surfaces the "call us instead" message.
 */
const SUBMIT_TIMEOUT_MS = 25000

async function postJson(endpoint, body) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS)
  try {
    return await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timer)
  }
}

async function assertDelivered(res, label) {
  let data = null
  try {
    data = await res.clone().json()
  } catch {
    /* non-JSON reply — fall back to the status code alone */
  }

  const softFail =
    data &&
    (data.success === 'false' ||
      data.success === false ||
      data.ok === false ||
      Array.isArray(data.errors))

  if (!res.ok || softFail) {
    const reason = data?.message || data?.errors?.[0]?.message || `HTTP ${res.status}`
    // eslint-disable-next-line no-console
    console.error(`[${label}] NOT DELIVERED — ${reason}`)
    throw new Error(reason)
  }
  return { ok: true }
}

export const emailRe = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i
export const phoneRe = /^[\d\s()+.-]{10,}$/

/** Formats as the visitor types: 8437426437 -> (843) 742-6437 */
export function formatPhone(value) {
  const d = value.replace(/\D/g, '').slice(0, 10)
  if (d.length <= 3) return d
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

export async function sendEnquiry(payload) {
  const body = {
    ...payload,
    _subject: `New website enquiry — ${payload.name || 'Unknown'}`,
    _to: LEADS_EMAIL,
    ...(LEADS_CC ? { _cc: LEADS_CC } : {}),
    _replyto: payload.email,
    submittedAt: new Date().toISOString(),
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
  }

  if (!ENDPOINT) {
    // Never claim success we cannot deliver — a form that fakes a "thank you"
    // loses real enquiries silently. Fail loudly so the visitor is told to
    // phone instead, and so a misconfigured deploy is obvious immediately.
    // eslint-disable-next-line no-console
    console.error(
      '[Brothers Pool] NOT SENT — VITE_FORM_ENDPOINT is not set. Nothing was emailed.',
      body
    )
    if (SIMULATE) {
      await new Promise((r) => setTimeout(r, 850))
      return { ok: true, simulated: true }
    }
    throw new Error('No form endpoint configured')
  }

  const res = await postJson(ENDPOINT, body)

  try {
    return await assertDelivered(res, 'Brothers Pool')
  } catch (err) {
    // FormSubmit refuses to deliver to an address until its owner clicks a
    // one-time activation link. If that has not happened, the enquiry would
    // simply be lost. Rather than drop a real lead, resend through the
    // already-activated studio channel with the business copied in — only the
    // endpoint address needs activating, CC recipients do not.
    const needsActivation = /activat/i.test(err?.message || '')
    if (!needsActivation || !STUDIO_ENDPOINT) throw err

    // eslint-disable-next-line no-console
    console.warn(
      `[Brothers Pool] ${LEADS_EMAIL} has not activated FormSubmit — ` +
        'delivering via the fallback channel so the enquiry is not lost.'
    )
    const relayed = await postJson(STUDIO_ENDPOINT, {
      ...body,
      _cc: LEADS_EMAIL,
      _subject: `[Brothers Pool enquiry] ${payload.name || 'Unknown'}`,
      deliveryNote: `Relayed: ${LEADS_EMAIL} has not activated its FormSubmit form.`,
    })
    return assertDelivered(relayed, 'Brothers Pool (relayed)')
  }
}

/**
 * Studio enquiries from the footer credit. Routed to VITE_STUDIO_FORM_ENDPOINT
 * so they reach the studio rather than the client — the two must never share
 * an inbox.
 */
const STUDIO_ENDPOINT = import.meta.env.VITE_STUDIO_FORM_ENDPOINT || ''

export async function sendStudioEnquiry(payload) {
  const body = {
    ...payload,
    _subject: `Website enquiry via Brothers Pool — ${payload.name || 'Unknown'}`,
    _to: studio.email,
    _replyto: payload.email,
    referredFrom: 'brotherspoolconstruction.com',
    submittedAt: new Date().toISOString(),
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
  }

  if (!STUDIO_ENDPOINT) {
    // eslint-disable-next-line no-console
    console.error(
      '[Luxe Web Studio] NOT SENT — VITE_STUDIO_FORM_ENDPOINT is not set. Nothing was emailed.',
      body
    )
    if (SIMULATE) {
      await new Promise((r) => setTimeout(r, 850))
      return { ok: true, simulated: true }
    }
    throw new Error('No studio form endpoint configured')
  }

  const res = await postJson(STUDIO_ENDPOINT, body)
  return assertDelivered(res, 'Luxe Web Studio')
}
