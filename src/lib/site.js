// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for site content. Everything the client might want to
// edit lives here, not buried in components.
// Sourced from brotherspoolconstruction.com (phone, email, services, history,
// reviews) — reviewer initials kept as published on the current site.
// ─────────────────────────────────────────────────────────────────────────────

export const company = {
  name: 'Brothers Pool Construction',
  short: 'Brothers Pool',
  founded: 1992,
  phone: '(843) 742-6437',
  phoneHref: 'tel:+18437426437',
  email: 'Sales@brotherspoolconstruction.com',
  emailHref: 'mailto:Sales@brotherspoolconstruction.com',
  region: 'Myrtle Beach & Coastal South Carolina',
  /** We travel this far from Myrtle Beach — the radius, not a fixed town list. */
  serviceRadiusMiles: 50,
  /** Centre of the service radius — inland, so the circle reaches further. */
  serviceCentre: 'Conway',
  serviceRadius: 'Anywhere within 50 miles of Conway, SC',
  hours: 'Mon – Fri, 8:00am – 5:00pm',
  facebook: 'https://www.facebook.com/brotherspoolsc',
  linkedin: 'https://www.linkedin.com/company/brothers-pool-construction',
}

/**
 * The studio that built the site. Deliberately separate from `company` — these
 * enquiries go to the studio, never to the client's inbox.
 */
export const studio = {
  name: 'Luxe Web Studio',
  email: 'luxewebstudio112@gmail.com',
  heading: 'Want a website like this one?',
  lede: 'We design and build premium sites for trades and service businesses — custom design, real photography, and motion that earns its place. No templates, no page builders.',
  points: [
    'Designed and built from scratch, never a theme',
    'Fast, accessible and built to rank',
    'Copywriting and photo direction included',
  ],
  projectTypes: [
    'A brand-new website',
    'Redesign of an existing site',
    'Landing page or microsite',
    'Not sure yet — advise me',
  ],
}

export const nav = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export const trust = [
  { label: 'Building pools since 1992', icon: 'calendar' },
  { label: 'In-house shotcrete & plaster crews', icon: 'trowel' },
  { label: 'Licensed & insured in SC and GA', icon: 'shield' },
]

export const services = [
  {
    n: '01',
    title: 'Pool Construction',
    blurb:
      'Shotcrete pools engineered from design to first fill. Steel, plumbing, shell and finish are all set by our own crews — no handoffs, no subcontracted guesswork.',
    points: ['Custom shotcrete shells', 'Spas & water features', 'Automation & lighting'],
    icon: 'construction',
  },
  {
    n: '02',
    title: 'Screen Enclosures',
    blurb:
      'Protect your outdoor living space from the elements, pests and debris with our engineered premium screens.',
    points: ['Engineered aluminium frames', 'Premium screen mesh', 'Pool & patio enclosures'],
    icon: 'screen',
  },
  {
    n: '03',
    title: 'Pool Renovation',
    blurb:
      'Tired shells brought back to current standards. New interior finish, tile, coping and equipment — make your pool new again.',
    points: ['Interior finish & plaster', 'Tile & coping replacement', 'Equipment modernisation'],
    icon: 'renovation',
  },
  {
    n: '04',
    title: 'Hardscapes',
    blurb:
      'Travertine, paver and synthetic turf work that ties the pool into the property. Set on properly compacted base so the deck stays true for decades.',
    points: ['Travertine & pavers', 'Retaining walls', 'Synthetic turf'],
    icon: 'hardscape',
  },
  {
    n: '05',
    title: 'Outdoor Living',
    blurb:
      'Kitchens, pergolas and lighting designed alongside the pool — so the whole yard lives as one space.',
    points: ['Outdoor kitchens', 'Pergolas & shade', 'Landscape lighting'],
    icon: 'outdoor',
  },
]

export const stats = [
  { value: 30, suffix: '+', label: 'Years building pools' },
  { value: 3, suffix: '', label: 'States served since 1992' },
  { value: 2000, suffix: '+', label: 'Customers served' },
  { value: 100, suffix: '%', label: 'Professional teams' },
]

/** Currently unused — the section it fed was replaced by testimonials. */
export const differentiators = [
  {
    n: '01',
    title: 'Three decades in the same trade',
    body:
      'We started as Brothers Pool Plastering in 1992 and never left the trade. The crews finishing your shell have done it thousands of times, not dozens.',
  },
  {
    n: '02',
    title: 'Our own crews, start to finish',
    body:
      'Steel, shotcrete, plaster, tile and deck are all in-house. That is why our schedules hold and why there is only ever one company answering for the work.',
  },
  {
    n: '03',
    title: 'Built for the Carolina coast',
    body:
      'High water tables, sandy soil and salt air punish shortcuts. Our engineering and finish specs are written for this coastline specifically.',
  },
  {
    n: '04',
    title: 'A straight answer on price',
    body:
      'One detailed proposal covering scope, allowances and schedule. No line-item surprises once the equipment is on your property.',
  },
]

export const process = [
  {
    n: '01',
    title: 'Consultation',
    body:
      'We walk the property, talk through how you actually want to use the space, and flag the site realities — grade, access, water table, setbacks — before anything is drawn.',
  },
  {
    n: '02',
    title: 'Design & Proposal',
    body:
      'You get a scaled layout, finish selections and a single itemised proposal. Scope, allowances and schedule are settled on paper first.',
  },
  {
    n: '03',
    title: 'Permits & Excavation',
    body:
      'We pull the permits and handle inspections. Layout is staked, dig begins, and the hole is cut to engineered dimensions.',
  },
  {
    n: '04',
    title: 'Steel, Plumbing & Shotcrete',
    body:
      'Rebar is tied to spec, plumbing pressure-tested, then shotcrete is shot and cured. This is the structure — it is where our crews earn their reputation.',
  },
  {
    n: '05',
    title: 'Tile, Coping & Patio',
    body:
      'Waterline tile and coping are set, then hardscape and decking go in. Elevations are checked constantly so water sits exactly where it should.',
  },
  {
    n: '06',
    title: 'Finish & Startup',
    body:
      'Interior finish is applied, the pool is filled, and we run startup chemistry with you on site. You leave knowing how to operate your own pool.',
  },
]

/**
 * Featured project — shown as a full-width case study. Finish and timeline are
 * PLACEHOLDER details written from the photo; confirm with the client.
 */
export const caseStudy = {
  img: '/img/pool-twilight.jpg',
  location: 'Grand Strand, SC',
  title: 'A pool that earns its keep after dark',
  body: 'A freeform pool with a raised circular spa spilling into the main body, wrapped in a paver deck that ties back to the house. Lighting was designed alongside the shell — colour-changing LED in both bodies of water, warm uplighting on the house, and the whole thing on automation, so the yard is as usable at nine at night as it is at noon.',
  specs: [
    { k: 'Scope', v: 'New construction — freeform pool, raised spillover spa' },
    { k: 'Finish', v: 'Paver deck and coping, stacked-stone spa surround' },
    { k: 'Systems', v: 'Colour-changing LED, landscape lighting, full automation' },
  ],
}

export const projects = [
  { img: '/img/work/pool-01.jpg', title: 'Oceanfront Pool & Spa', meta: 'New construction', pos: 'center' },
  { img: '/img/work/pool-02.jpg', title: 'Freeform Pool & Glass-Tile Spa', meta: 'New construction', pos: 'center' },
  { img: '/img/work/pool-03.jpg', title: 'Pool, Spa & Paver Deck', meta: 'New construction', pos: 'center' },
  { img: '/img/work/pool-04.jpg', title: 'Rectangular Pool & Spillover Spa', meta: 'New construction', pos: 'center' },
]

/**
 * Full project archive, revealed by "View all" under the featured grid.
 * Built to hold twenty-plus — add entries here and the horizontal gallery
 * picks them up with no component changes.
 */
export const gallery = [
  { img: '/img/work/pool-01.jpg', title: 'Oceanfront Pool & Spa', meta: 'New construction' },
  { img: '/img/work/pool-02.jpg', title: 'Freeform Pool & Glass-Tile Spa', meta: 'New construction' },
  { img: '/img/work/pool-03.jpg', title: 'Pool, Spa & Paver Deck', meta: 'New construction' },
  { img: '/img/work/pool-04.jpg', title: 'Rectangular Pool & Spillover Spa', meta: 'New construction' },
  { img: '/img/work/pool-05.jpg', title: 'Rectangular Pool & Patio', meta: 'New construction' },
  { img: '/img/work/pool-06.jpg', title: 'Pool & Paver Patio', meta: 'New construction' },
  { img: '/img/work/pool-07.jpg', title: 'Pool, Raised Wall & Planting', meta: 'New construction' },
  { img: '/img/work/pool-08.jpg', title: 'Freeform Pool & Paver Deck', meta: 'New construction' },
  { img: '/img/work/pool-09.jpg', title: 'Pool & Spa from Above', meta: 'New construction' },
  { img: '/img/work/pool-10.jpg', title: 'Rectangular Pool, Aerial', meta: 'New construction' },
  { img: '/img/work/pool-11.jpg', title: 'Pool & Flagstone Deck', meta: 'New construction' },
  { img: '/img/work/pool-12.jpg', title: 'Rock Waterfall at Night', meta: 'Water feature' },
  { img: '/img/work/pool-13.jpg', title: 'Pool & Pergola, Evening', meta: 'Outdoor living' },
  { img: '/img/work/pool-14.jpg', title: 'Pool & Basketball Goal', meta: 'Outdoor living' },
  { img: '/img/work/pool-15.jpg', title: 'Raised Spa, Glass Tile', meta: 'Spa & water feature' },
  { img: '/img/work/pool-16.jpg', title: 'Waterline Tile & Sun Ledge', meta: 'Finish detail' },
  { img: '/img/work/pool-17.jpg', title: 'Spillover Steps', meta: 'Water feature' },
  { img: '/img/work/pool-18.jpg', title: 'Glass Tile Water Wall', meta: 'Water feature' },
  { img: '/img/work/pool-19.jpg', title: 'Waterline Tile Detail', meta: 'Finish detail' },
  { img: '/img/work/pool-20.jpg', title: 'Interior Finish & Tile', meta: 'Finish detail' },
  { img: '/img/work/pool-21.jpg', title: 'Spa Jets', meta: 'Spa & water feature' },
  { img: '/img/work/pool-22.jpg', title: 'Entry Steps', meta: 'Finish detail' },
  { img: '/img/work/pool-23.jpg', title: 'Freeform Pool & Terrace', meta: 'Design concept' },
  { img: '/img/work/pool-24.jpg', title: 'Freeform Pool & Spa', meta: 'Design concept' },
  { img: '/img/work/pool-25.jpg', title: 'Freeform Pool & Patio', meta: 'Design concept' },
  { img: '/img/work/pool-26.jpg', title: 'Pool, Spa & Sun Deck', meta: 'Design concept' },
  { img: '/img/work/pool-27.jpg', title: 'Rectangular Pool & Pavilion', meta: 'Design concept' },
  { img: '/img/work/pool-28.jpg', title: 'Pool, Spa & Lounge Terrace', meta: 'Design concept' },
  { img: '/img/work/pool-29.jpg', title: 'Pool & Spa, Modern Home', meta: 'Design concept' },
  { img: '/img/work/pool-30.jpg', title: 'Pool, Spa & Deck', meta: 'Design concept' },
  { img: '/img/work/pool-31.jpg', title: 'Pool, Spa & Planting', meta: 'Design concept' },
  { img: '/img/work/pool-32.jpg', title: 'Pool & Fire Pit, Evening', meta: 'Design concept' },
  { img: '/img/work/pool-33.jpg', title: 'Freeform Pool & Spa Terrace', meta: 'Design concept' },
]

export const timeline = [
  {
    year: '1992',
    chapter: 'Miami, Florida',
    title: 'Brothers Pool Plastering',
    body: 'Four brothers start out in Miami specialising in high-end pool finishes, and evolving the trade as they go.',
    img: '/img/pool-geometric.jpg',
    // Earlier chapters are toned back so they read as memory, not portfolio.
    tone: 'grayscale(0.34) sepia(0.07) contrast(1.02)',
  },
  {
    year: '1996',
    chapter: 'Georgia',
    title: 'The crew builders called first',
    body: 'We grow north and become one of the largest plaster and finish teams in the Southeast, and continue to practise the trade of pool building.',
    img: '/img/hero-pool.jpg',
    tone: 'grayscale(0.5) sepia(0.1) contrast(1.02)',
  },
  {
    year: '2006',
    chapter: 'The Grand Strand',
    title: 'Myrtle Beach',
    body: 'We open on the Carolina coast to serve the Grand Strand directly — high water tables, sandy soil, salt air, and a way of building that suits all three.',
    img: '/img/pool-slide.jpg',
    tone: 'grayscale(0.4) sepia(0.08) contrast(1.02)',
  },
  {
    year: 'Today',
    chapter: 'Start to finish',
    title: 'Full outdoor projects',
    body: 'Decades of pool-building experience culminating in a quality-first builder with a reputation to match.',
    img: '/img/brand-truck.jpg',
    tone: 'none',
  },
]

export const testimonials = [
  {
    quote:
      'Exceptional from the beginning. Communication was awesome and they stood behind everything they promised.',
    author: 'J. Nichols',
    meta: 'Pool construction',
  },
  {
    quote:
      'Five stars. The pool came out amazing and the workers were very pleasant and professional the entire time.',
    author: 'T. Senese',
    meta: 'Pool construction',
  },
  {
    quote: 'Quality work and the staff was great to deal with from the first call to the last day.',
    author: 'M. Cross',
    meta: 'Renovation',
  },
]

export const faqs = [
  {
    q: 'How long does a new pool take to build?',
    a: 'Approximately 90 days from excavation to startup, weather and inspections permitting. We give you a phase-by-phase schedule at proposal so you know what is happening in which week rather than wondering.',
  },
  {
    q: 'Do you build screen enclosures?',
    a: 'Yes. We design and install engineered aluminium screen enclosures over pools and patios. They keep leaves, pollen and insects out, cut cleaning down to a fraction, and take the edge off the sun without closing the space in. We can build over an existing pool or design the enclosure alongside a new one so the two work together.',
  },
  {
    q: 'What areas do you serve?',
    a: 'We work anywhere within about 50 miles of Conway, which covers the whole Grand Strand — Myrtle Beach, North Myrtle Beach, Murrells Inlet, Pawleys Island, Surfside, Little River and Georgetown — and reaches well inland to Aynor, Loris, Mullins, Marion and Lake City, plus just over the line into Brunswick County, NC. If you are near the edge of that, call and ask rather than assuming: we travel further for the right project.',
  },
  {
    q: 'Is financing available?',
    a: 'Yes. We work with pool-specific lenders who handle construction draws, and we can point you at options before you finalise scope so budget and design get decided together.',
  },
  {
    q: 'Can you renovate a pool another company built?',
    a: 'Most of our renovation work is on other builders’ pools. We assess the shell, plumbing and equipment first, tell you honestly what is worth keeping, and quote only the work that actually needs doing.',
  },
  {
    q: 'Who will walk us through the project?',
    a: 'Each project leader is ready and available for questions by our customers. You are not routed through a call centre or handed between departments — the person running your build is the person you talk to.',
  },
  {
    q: 'Do you handle permits and inspections?',
    a: 'We do. Permitting, scheduling inspections and meeting the inspector on site are all part of our scope. Coastal jurisdictions each have their own quirks and we deal with them regularly.',
  },
]

export const serviceOptions = [
  'New Pool Construction',
  'Screen Enclosures',
  'Pool Renovation',
  'Hardscapes',
  'Outdoor Living',
]

/** Budget slider bounds, in thousands. Top of the range reads as "150k+". */
export const budgetRange = {
  min: 45,
  max: 150,
  step: 1,
}

export const timelineOptions = [
  'As soon as possible',
  'Next 3 months',
  'Next 6 months',
  'This time next year',
  'Just researching',
]

/** Marquee band under the work grid — the places we actually work. */
export const serviceAreas = [
  'Myrtle Beach',
  'North Myrtle Beach',
  'Murrells Inlet',
  'Pawleys Island',
  'Conway',
  'Little River',
  'Georgetown',
  'Carolina Forest',
  'Surfside Beach',
  'Garden City',
]

/**
 * Autocomplete suggestions for the enquiry form — NOT a limit. We work to a
 * 50-mile radius, so the field accepts any town or ZIP the visitor types.
 */
export const cities = [
  'Myrtle Beach',
  'North Myrtle Beach',
  'Murrells Inlet',
  'Pawleys Island',
  'Surfside Beach',
  'Garden City',
  'Conway',
  'Little River',
  'Georgetown',
  'Carolina Forest',
  'Longs',
  'Loris',
  'Aynor',
  'Socastee',
  'Calabash, NC',
  'Sunset Beach, NC',
]
