/**
 * Rebuilds the "Pools we have put in the ground" section from a fresh batch
 * of client photos — and nothing else on the site is touched.
 *
 *   1. drop the photos into  _drop/pools/
 *   2. run                   node scripts/add-pool-photos.mjs
 *
 * Files are taken in filename order. The first FEATURED are shown in the grid;
 * every one of them (including the featured) goes into the "See more" gallery.
 * Name them 01-…, 02-… to control which lead.
 *
 * Black letterbox bars from phone screenshots are detected and cropped, HEIC is
 * converted, and everything is re-encoded to web-weight JPEG.
 */
import puppeteer from 'puppeteer-core'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const SRC = '_drop/pools'
const OUT = 'public/img/work'
const FEATURED = 4          // how many appear in the grid before "See more"
const DEV = 'http://localhost:5180'

const files = fs.existsSync(SRC)
  ? fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png|heic|webp)$/i.test(f)).sort()
  : []

if (!files.length) {
  console.error(`\nNo images in ${SRC}/ — drop the pool photos there first.\n`)
  process.exit(1)
}
console.log(`Found ${files.length} photo(s)\n`)

fs.mkdirSync(OUT, { recursive: true })
fs.rmSync('public/_stage', { recursive: true, force: true })
fs.mkdirSync('public/_stage', { recursive: true })

// HEIC needs converting before a browser will decode it.
const staged = files.map((f) => {
  const src = path.join(SRC, f)
  let use = src
  if (/\.heic$/i.test(f)) {
    use = path.join('public/_stage', f.replace(/\.heic$/i, '.jpg'))
    execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '92', src, '--out', use])
  } else {
    use = path.join('public/_stage', f)
    fs.copyFileSync(src, use)
  }
  return { original: f, staged: path.basename(use) }
})

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
const page = await browser.newPage()
await page.goto(DEV, { waitUntil: 'domcontentloaded' })

const installed = []
for (let i = 0; i < staged.length; i++) {
  const { original, staged: name } = staged[i]
  const res = await page.evaluate(async (name) => {
    const img = new Image()
    img.src = '/_stage/' + name
    await img.decode()
    const c = document.createElement('canvas')
    c.width = img.naturalWidth
    c.height = img.naturalHeight
    const g = c.getContext('2d', { willReadFrequently: true })
    g.drawImage(img, 0, 0)
    const { data, width, height } = g.getImageData(0, 0, c.width, c.height)

    const lit = (x, y) => { const i = (y * width + x) * 4; return data[i] + data[i + 1] + data[i + 2] > 60 }
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

  const outName = `pool-${String(i + 1).padStart(2, '0')}.jpg`
  const buf = Buffer.from(res.data.split(',')[1], 'base64')
  fs.writeFileSync(path.join(OUT, outName), buf)
  installed.push(outName)
  console.log(
    `${String(i + 1).padStart(2, '0')}. ${original}` +
    `\n    ${res.src} → ${res.out}, ${(buf.length / 1024).toFixed(0)}KB → ${OUT}/${outName}` +
    `${i < FEATURED ? '   [featured]' : ''}`
  )
}
await browser.close()
fs.rmSync('public/_stage', { recursive: true, force: true })

// ── Rewrite just the two arrays that drive that section ──────────────────
const entry = (f) => `  { img: '/img/work/${f}', title: '', meta: '', pos: 'center' },`
const projects = installed.slice(0, FEATURED).map(entry).join('\n')
const galleryEntries = installed.map((f) => `  { img: '/img/work/${f}', title: '', meta: '' },`).join('\n')

const sitePath = 'src/lib/site.js'
let site = fs.readFileSync(sitePath, 'utf8')
const swap = (name, body) => {
  const start = site.indexOf(`export const ${name} = [`)
  const end = site.indexOf('\n]', start) + 2
  site = site.slice(0, start) + `export const ${name} = [\n${body}\n]` + site.slice(end)
}
swap('projects', projects)
swap('gallery', galleryEntries)
fs.writeFileSync(sitePath, site)

console.log(`\nWired into site.js:`)
console.log(`  featured grid : ${Math.min(FEATURED, installed.length)} photo(s)`)
console.log(`  "See more"    : ${installed.length} photo(s)`)
console.log(`\nCaptions are left blank — send me the titles/locations and I'll fill them in.`)
console.log('Done. The dev server will hot-reload.')
