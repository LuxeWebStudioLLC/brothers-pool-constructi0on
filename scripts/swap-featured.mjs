/**
 * Swaps the second featured tile in "Pools we have put in the ground" for a new
 * photo. Crops phone-screenshot letterbox bars, resizes, installs, and rewrites
 * the caption. Nothing else on the site is touched.
 */
import puppeteer from 'puppeteer-core'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const SRC = process.env.SRC || '_drop/swap'
const TARGET = process.env.TARGET || 'public/img/work/pool-02.jpg'
const TITLE = process.env.TITLE || 'Freeform Pool & Glass-Tile Spa'
const META = process.env.META || 'New construction'

const files = fs.existsSync(SRC)
  ? fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png|heic|webp)$/i.test(f))
  : []
if (!files.length) { console.error(`\nNothing in ${SRC}/ — drop the photo there first.\n`); process.exit(1) }
if (files.length > 1) console.warn(`(${files.length} files found — using ${files[0]})`)

let src = path.join(SRC, files[0])
fs.mkdirSync('public/_stage', { recursive: true })
if (/\.heic$/i.test(src)) {
  const out = 'public/_stage/in.jpg'
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '92', src, '--out', out])
  src = out
} else {
  fs.copyFileSync(src, 'public/_stage/in' + path.extname(src))
  src = 'public/_stage/in' + path.extname(src)
}

const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
const page = await browser.newPage()
await page.goto('http://localhost:5180/', { waitUntil: 'domcontentloaded' })

const res = await page.evaluate(async (name) => {
  const img = new Image(); img.src = '/_stage/' + name; await img.decode()
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight
  const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0)
  const { data, width, height } = g.getImageData(0, 0, c.width, c.height)
  const lit = (x, y) => { const i = (y * width + x) * 4; return data[i] + data[i+1] + data[i+2] > 60 }
  const colLit = (x) => { for (let y = 0; y < height; y += 4) if (lit(x, y)) return true; return false }
  const rowLit = (y) => { for (let x = 0; x < width; x += 4) if (lit(x, y)) return true; return false }
  let x0=0, x1=width-1, y0=0, y1=height-1
  while (x0 < x1 && !colLit(x0)) x0++
  while (x1 > x0 && !colLit(x1)) x1--
  while (y0 < y1 && !rowLit(y0)) y0++
  while (y1 > y0 && !rowLit(y1)) y1--
  const cw = x1-x0+1, ch = y1-y0+1
  const scale = Math.min(1, 1400 / cw)
  const o = document.createElement('canvas')
  o.width = Math.round(cw*scale); o.height = Math.round(ch*scale)
  o.getContext('2d').drawImage(img, x0, y0, cw, ch, 0, 0, o.width, o.height)
  return { src: `${width}x${height}`, out: `${o.width}x${o.height}`, data: o.toDataURL('image/jpeg', 0.80) }
}, path.basename(src))

await browser.close()
const buf = Buffer.from(res.data.split(',')[1], 'base64')
fs.writeFileSync(TARGET, buf)
fs.rmSync('public/_stage', { recursive: true, force: true })
console.log(`${files[0]}\n  ${res.src} → ${res.out}, ${(buf.length/1024).toFixed(0)}KB → ${TARGET}`)

const sp = 'src/lib/site.js'
let site = fs.readFileSync(sp, 'utf8')
for (const arr of ['projects', 'gallery']) {
  const start = site.indexOf(`export const ${arr} = [`)
  const end = site.indexOf('\n]', start)
  let block = site.slice(start, end)
  block = block.replace(
    new RegExp(`(\\{ img: '/img/work/${path.basename(TARGET)}', title: ')[^']*(', meta: ')[^']*(')`),
    `$1${TITLE}$2${META}$3`
  )
  site = site.slice(0, start) + block + site.slice(end)
}
fs.writeFileSync(sp, site)
console.log(`  caption → "${TITLE}" / "${META}"`)
console.log('\nDone. Dev server hot-reloads; commit and push when you are happy.')
