# Brothers Pool Construction — website

New marketing site for Brothers Pool Construction (Myrtle Beach, SC). React + Vite,
Tailwind CSS v4, GSAP ScrollTrigger.

```bash
npm install
npm run dev      # http://localhost:5180
npm run build    # → dist/
npm run preview  # serve the production build
```

## Structure

```
src/
  lib/site.js      All copy, services, FAQs, projects, contact details — edit here, not in components
  lib/anim.js      GSAP + ScrollTrigger/SplitText registration
  lib/motion.js    Visibility/reduced-motion gate for entrance animations
  lib/forms.js     Phone formatting, validation regexes, enquiry submission
  components/      One file per section, in the order they appear in App.jsx
public/img/        Logo and photography
```

`src/lib/site.js` is the single source of truth for content. Changing a service,
FAQ, testimonial or phone number is a one-line edit there.

## Page order

Hero → services (editorial index) → why it lasts (stats) → **case study
(full-bleed)** → selected work → area marquee → **contact (mid-page)** →
our story (full-bleed) → why Brothers → process → FAQ → footer.

The fast-quote bar, trust strip and standalone testimonials section were
removed. The contact section is the single enquiry path and sits mid-page,
right after the work; one testimonial lives on as the pull-quote inside the
case study, and the other two remain in `site.js` unused.

## Typography

Headings are set in **Fraunces** (editorial serif, optical sizing); body is
DM Sans; Sora remains for UI — buttons, eyebrows, nav, form labels. Primary
buttons are white with an aqua hover-wipe; aqua is reserved for hairlines,
eyebrows and small marks, ember for numerals, years and editorial accents.

## The contact form

Two entry points share one submit path (`src/lib/forms.js`):

- the **fast quote bar** under the hero — name, phone, city, project type
- the **full enquiry form** in `#contact` — three grouped steps, multi-select
  service chips, budget and timeline, inline validation, a completion meter, and
  an animated success state

**Service area.** The business works to a **50-mile radius of Myrtle Beach**,
set as `company.serviceRadiusMiles` in `site.js`. The form's location field is
free text with a `<datalist>` of common towns — the list is autocomplete only,
never a whitelist, so someone in an unlisted town can still enquire. Change the
radius in one place and the contact row, footer, lede, field hint and marquee
all follow.

**Service-area map.** `ServiceMap.jsx` (in the contact section) is a
self-drawn SVG of the Grand Strand — no map service, no tiles, no third-party
requests. Towns and the 50-mile ring are projected from real lon/lat
coordinates (equirectangular, latitude-corrected), the coastline draws on
scroll via DrawSVG, and the home marker carries a quiet locator pulse. Edit the
`TOWNS` table in that file to add or move towns.

**Studio credit.** The very bottom bar carries a quiet "Built by Luxe Web Studio"
line (`StudioCredit.jsx`). Clicking it opens a modal pitching the studio with its
own short enquiry form. Those submissions go to `VITE_STUDIO_FORM_ENDPOINT` —
**keep it different from `VITE_FORM_ENDPOINT`**, since studio leads must not land
in the client's inbox. Studio details live in `studio` in `site.js`.

**Current state:** both forms are live via FormSubmit and deliver to
`luxewebstudio112@gmail.com` (set in `.env`). FormSubmit requires a one-time
activation click in that inbox before mail flows. To hand leads over to the
client later, change `VITE_FORM_ENDPOINT` and `VITE_LEADS_EMAIL` to their
address — that address then needs its own one-time activation.

**Wiring it to a different inbox:** copy `.env.example` to `.env` and set
`VITE_FORM_ENDPOINT` to any handler that accepts a JSON POST — Formspree, Basin,
a Netlify/Vercel function, or your own API. The payload includes every field plus
`_to`, `_subject`, `submittedAt` and `pageUrl`.

Until that variable is set the form still validates and shows its success state,
and logs the payload to the browser console. **Nothing is emailed yet** — this
has to be set before launch.

## Motion

Entrance animations are gated by `src/lib/motion.js`. It skips them when the
visitor prefers reduced motion, and when the page loads in a background tab —
where `requestAnimationFrame` never fires, so a `gsap.from()` would otherwise
leave content stuck at `opacity: 0`. If a hidden tab later becomes visible, the
animations wire up at that point.

Scroll-linked effects:

- **Read-progress hairline** under the nav (`ScrollProgress.jsx`), scrubbed
  against `ScrollTrigger.maxScroll` so it tracks the scrollbar exactly
- **Masked line-by-line heading reveals** via `SplitText`, split after
  `document.fonts.ready` so lines break on final metrics
- **Work-grid tiles unmask upward** with a `clip-path` wipe while the photo
  inside settles back from a 1.16 overscale — batched with
  `ScrollTrigger.batch` so one trigger set covers the whole grid
- **Process rail** draws down as you read, each node flipping ember → aqua as
  you pass it
- **Service-area marquee** (`AreaMarquee.jsx`) drifts on its own, but scroll
  velocity adds to it and scrolling up reverses it
- **Hero opening** — the photograph expands outward from an inset frame to full
  bleed before the copy arrives
- **Sticky story** (`Heritage.jsx`) — deliberately NOT a GSAP pin. Pinning froze
  the page for several viewports, which read as "this is the bottom of the
  site". Instead the copy scrolls normally and only the photography holds still,
  via native CSS `position: sticky` (compositor-driven, far smoother than a
  JS pin). Four eras crossfade their backdrops with a progress rail pinned to
  the bottom of the sticky layer. Verified: zero `.pin-spacer` elements, and
  content translates on 100% of frames through the section.
- **Word-scrub statement** (`ScrubText.jsx`) — the "why it lasts" paragraph
  resolves word by word as it crosses the viewport; used once by design
- **Service-area map** — coastline draws in, the 50-mile ring scales up, towns
  pop in staggered, and the Myrtle Beach marker pulses

Animation smoothness is measured, not assumed: `.review/smooth.mjs` samples
the hero clip curve frame by frame and drives a scripted scroll through the
pinned story recording rAF deltas. Current numbers: hero clip interpolates
9%→0% with no snap; story scrub worst frame 19.6ms, zero frames over 33ms.
- **Hero media parallax**, image drift in the work grid and feature panels, and
  counting stats with ember punctuation

**Phones get the identical experience** — the sticky story sequence with all
four era crossfades and its progress rail, work-grid parallax, and the marquee's
scroll-velocity response all run at every breakpoint. There are no
`matchMedia` size gates left in the components.

That was measured, not assumed: `.review/mobileperf.mjs` drives a 390×844
viewport with **4× CPU throttling** (mid-range phone) through the story section.
Current numbers: worst frame 20.5ms, zero frames over 33ms, 0% frozen frames,
and all four crossfades firing in order. Re-run it after any motion change.

## Hero video

There is no hero footage yet, so the hero uses a still. `src/components/Hero.jsx`
has a commented `<video>` block right above the `<img>` — drop a file at
`public/video/hero.mp4`, swap the two, and keep `poster="/img/hero-pool.jpg"` so
the layout is identical until the video loads.

## Photography

All imagery is now real, full-resolution client photography. The low-resolution
`g*.jpg` thumbnails scraped from the old site have been deleted entirely.

| File | Used for |
|---|---|
| `pool-twilight.jpg` | Case study (full-bleed) |
| `hero-pool.jpg` | Hero, story 1996 |
| `pool-modern.jpg` | Work grid |
| `pool-slide.jpg` | Work grid, story 2006 |
| `pool-build.jpg` | Work grid, story 1992 |
| `pool-freeform.jpg` | "Why it lasts" panel, work grid |
| `brand-truck.jpg` | Story "Today" |

### Adding more photos

Client photos arrive as phone screenshots with black letterbox bars. Drop new
ones into `_drop/` and run:

```bash
node scripts/add-photos.mjs
```

It converts HEIC, auto-detects the real photo content, crops the bars,
re-encodes to JPEG at max 2400px wide, installs under `public/img/`, and wires
the result into `src/lib/site.js`. The dev server must be running.

Story backdrops carry a mild `tone` filter (set per era in `timeline`) so the
past chapters read as a different register from the crisp portfolio shots;
"Today" is left at full colour as the payoff.

Still worth asking the client for: a twilight shot of a *rectangular* pool, and
anything showing renovation or hydro blasting in progress. The service list
covers six disciplines but the photography only evidences new construction and
outdoor living.

## Content accuracy — please confirm

Phone, email, services, company history (1992 Miami → 1996 Georgia → 2006 Myrtle
Beach) and the three testimonials are taken from the current site. These were
written to fill out the new layout and are **not** verified facts:

- the case-study body and spec table in `caseStudy` in `site.js` — scope,
  finish and systems were written from what the photograph shows
- the town attributed to each project in `projects` — captions describe the
  photo accurately, but the locations are assumed

- `stats` in `site.js` — "1,200+ pools built & renovated" and "3 states"
- build-duration claims in the FAQ (10–14 weeks) and "renovations back in service
  inside three weeks"
- the specific towns listed in `serviceAreas` and in project captions
- "Licensed & insured in SC and GA" in the trust strip and footer

## QA tooling

`.review/` holds throwaway scripts that drive the installed Chrome via
`puppeteer-core` to capture full-page desktop and mobile screenshots, check for
horizontal overflow, and exercise the contact form end to end.

```bash
node .review/shots.mjs      # sliced full-page captures + overflow report
node .review/sections.mjs   # mobile menu, per-section shots, form states
```
