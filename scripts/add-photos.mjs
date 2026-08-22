/**
 * Drop-folder photo installer.
 *
 * Put the two photos in `_drop/` (any filename, HEIC/PNG/JPG all fine) and run:
 *     node scripts/add-photos.mjs
 *
 * It crops the black letterbox bars phone screenshots carry, re-encodes to
 * web-weight JPEG, installs them under public/img/, and wires them into
 * src/lib/site.js — the screen-enclosure shot as the first story chapter, the
 * aerial geometric pool as the fourth tile in the work grid.
 */
import puppeteer from 'puppeteer-core'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const DROP = '_drop'
const OUT = 'public/img'

// Routed by filename where possible, else by sort order.
//   screened enclosure  -> work grid, bottom-right tile
//   aerial geometric    -> Our Story, 1992 backdrop
const TARGETS = [
  { file: 'pool-screen.jpg', role: 'Work grid — bottom-right tile', match: /screen|enclos|work|^1/i },
  { file: 'pool-geometric.jpg', role: 'Our Story — 1992 backdrop', match: /geo|aerial|story|1992|^2/i },
]

const found = fs
  .readdirSync(DROP)
  .filter((f) => /\.(jpe?g|png|heic)$/i.test(f))
  .sort()

if (!found.length) {
  console.error(`\nNothing in ${DROP}/. Save the two photos there first, then re-run.\n`)
  process.exit(1)
}
console.log(`Found ${found.length} file(s): ${found.join(', ')}\n`)

// HEIC needs converting before a browser will decode it.
const staged = found.map((f) => {
  const src = path.join(DROP, f)
  if (!/\.heic$/i.test(f)) return src
  const jpg = src.replace(/\.heic$/i, '.converted.jpg')
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '92', src, '--out', jpg])
  return jpg
})

// Serve the staging folder so the page can read pixels without CORS trouble.
fs.mkdirSync('public/_drop', { recursive: true })
staged.forEach((s) => fs.copyFileSync(s, path.join('public/_drop', path.basename(s))))

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
const page = await browser.newPage()
await page.goto('http://localhost:5180/', { waitUntil: 'domcontentloaded' })

// Pair each file with a target: filename hints win, leftovers fill in order.
const pairs = []
const pool = [...staged]
for (const t of TARGETS) {
  const hit = pool.findIndex((f) => t.match.test(path.basename(f)))
  if (hit !== -1) pairs.push([pool.splice(hit, 1)[0], t])
}
for (const t of TARGETS) {
  if (pairs.some(([, tt]) => tt === t)) continue
  if (pool.length) pairs.push([pool.shift(), t])
}

for (let i = 0; i < pairs.length; i++) {
  const [stagedFile, target] = pairs[i]
  const name = path.basename(stagedFile)
  const res = await page.evaluate(async (name) => {
    const img = new Image()
    img.src = '/_drop/' + name
    await img.decode()
    const c = document.createElement('canvas')
    c.width = img.naturalWidth
    c.height = img.naturalHeight
    const g = c.getContext('2d', { willReadFrequently: true })
    g.drawImage(img, 0, 0)
    const { data, width, height } = g.getImageData(0, 0, c.width, c.height)

    const lit = (x, y) => { const i = (y * width + x) * 4; return data[i] + data[i+1] + data[i+2] > 60 }
    const colLit = (x) => { for (let y = 0; y < height; y += 4) if (lit(x, y)) return true; return false }
    const rowLit = (y) => { for (let x = 0; x < width; x += 4) if (lit(x, y)) return true; return false }
    let x0 = 0, x1 = width - 1, y0 = 0, y1 = height - 1
    while (x0 < x1 && !colLit(x0)) x0++
    while (x1 > x0 && !colLit(x1)) x1--
    while (y0 < y1 && !rowLit(y0)) y0++
    while (y1 > y0 && !rowLit(y1)) y1--

    const cw = x1 - x0 + 1, ch = y1 - y0 + 1
    const scale = Math.min(1, 2400 / cw)
    const o = document.createElement('canvas')
    o.width = Math.round(cw * scale)
    o.height = Math.round(ch * scale)
    o.getContext('2d').drawImage(img, x0, y0, cw, ch, 0, 0, o.width, o.height)
    return { src: `${width}x${height}`, out: `${o.width}x${o.height}`, data: o.toDataURL('image/jpeg', 0.86) }
  }, name)

  const buf = Buffer.from(res.data.split(',')[1], 'base64')
  fs.writeFileSync(path.join(OUT, target.file), buf)
  console.log(`${name}`)
  console.log(`   ${res.src} → cropped → ${res.out}, ${(buf.length / 1024).toFixed(0)}KB`)
  console.log(`   → ${OUT}/${target.file}   (${target.role})\n`)
}
await browser.close()
fs.rmSync('public/_drop', { recursive: true, force: true })
staged.filter((s) => s.includes('.converted.')).forEach((s) => fs.rmSync(s, { force: true }))

// ── Wire them into the content layer ──────────────────────────────────────
const sitePath = 'src/lib/site.js'
let site = fs.readFileSync(sitePath, 'utf8')
let changed = []

// screened enclosure → fourth work-grid tile (fills the empty bottom-right cell)
if (fs.existsSync(path.join(OUT, 'pool-screen.jpg')) && !site.includes('pool-screen.jpg')) {
  site = site.replace(
    `  {
    img: '/img/pool-build.jpg',
    title: 'Pool, Pergola & Fire Feature',
    meta: 'Outdoor living · Little River, SC',
    pos: 'center',
  },
]`,
    `  {
    img: '/img/pool-build.jpg',
    title: 'Pool, Pergola & Fire Feature',
    meta: 'Outdoor living · Little River, SC',
    pos: 'center',
  },
  {
    img: '/img/pool-screen.jpg',
    title: 'Screened Enclosure, Pool & Spa',
    meta: 'New construction · Conway, SC',
    pos: 'center',
  },
]`
  )
  changed.push('work grid → bottom-right tile added (pool-screen.jpg)')
}

// aerial geometric → 1992 story backdrop
if (fs.existsSync(path.join(OUT, 'pool-geometric.jpg')) && !site.includes('pool-geometric.jpg')) {
  site = site.replace(
    "    img: '/img/pool-build.jpg',\n    // Earlier chapters",
    "    img: '/img/pool-geometric.jpg',\n    // Earlier chapters"
  )
  changed.push('Our Story 1992 backdrop → pool-geometric.jpg')
}

fs.writeFileSync(sitePath, site)
console.log(changed.length ? 'Wired into site.js:\n  ' + changed.join('\n  ') + '\n' : 'site.js already up to date.\n')
console.log('Done — the dev server will hot-reload.')
