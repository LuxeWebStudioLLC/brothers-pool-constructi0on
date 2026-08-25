/**
 * Appends one photo to the end of the "View gallery" archive.
 *   SRC=_drop/gal TITLE="..." META="..." node scripts/add-gallery-photo.mjs
 */
import puppeteer from 'puppeteer-core'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const SRC = process.env.SRC || '_drop/gal'
const TITLE = process.env.TITLE || ''
const META = process.env.META || ''

const files = fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png|heic|webp)$/i.test(f))
if (!files.length) { console.error(`Nothing in ${SRC}/`); process.exit(1) }

const existing = fs.readdirSync('public/img/work').filter((f) => /^pool-\d+\.jpg$/.test(f))
const next = Math.max(...existing.map((f) => Number(f.match(/\d+/)[0]))) + 1
const outName = `pool-${String(next).padStart(2, '0')}.jpg`

let src = path.join(SRC, files[0])
fs.mkdirSync('public/_stage', { recursive: true })
const staged = 'public/_stage/in' + (/\.heic$/i.test(src) ? '.jpg' : path.extname(src))
if (/\.heic$/i.test(src)) execFileSync('sips', ['-s','format','jpeg','-s','formatOptions','92', src, '--out', staged])
else fs.copyFileSync(src, staged)

const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
const page = await browser.newPage()
await page.goto('http://localhost:5180/', { waitUntil: 'domcontentloaded' })
const res = await page.evaluate(async (name) => {
  const img = new Image(); img.src = '/_stage/' + name; await img.decode()
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight
  const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0)
  const { data, width, height } = g.getImageData(0, 0, c.width, c.height)
  const lit = (x,y) => { const i=(y*width+x)*4; return data[i]+data[i+1]+data[i+2] > 60 }
  const colLit = (x) => { for (let y=0;y<height;y+=4) if (lit(x,y)) return true; return false }
  const rowLit = (y) => { for (let x=0;x<width;x+=4) if (lit(x,y)) return true; return false }
  let x0=0,x1=width-1,y0=0,y1=height-1
  while (x0<x1 && !colLit(x0)) x0++
  while (x1>x0 && !colLit(x1)) x1--
  while (y0<y1 && !rowLit(y0)) y0++
  while (y1>y0 && !rowLit(y1)) y1--
  const cw=x1-x0+1, ch=y1-y0+1, scale=Math.min(1, 1400/cw)
  const o = document.createElement('canvas')
  o.width=Math.round(cw*scale); o.height=Math.round(ch*scale)
  o.getContext('2d').drawImage(img, x0,y0,cw,ch, 0,0,o.width,o.height)
  return { src:`${width}x${height}`, out:`${o.width}x${o.height}`, data:o.toDataURL('image/jpeg', 0.80) }
}, path.basename(staged))
await browser.close()

const buf = Buffer.from(res.data.split(',')[1], 'base64')
fs.writeFileSync(path.join('public/img/work', outName), buf)
fs.rmSync('public/_stage', { recursive: true, force: true })
console.log(`${files[0]}\n  ${res.src} → ${res.out}, ${(buf.length/1024).toFixed(0)}KB → public/img/work/${outName}`)

const sp = 'src/lib/site.js'
let site = fs.readFileSync(sp, 'utf8')
const start = site.indexOf('export const gallery = [')
const end = site.indexOf('\n]', start)
const row = `  { img: '/img/work/${outName}', title: '${TITLE.replace(/'/g, "\\'")}', meta: '${META}' },`
site = site.slice(0, end) + '\n' + row + site.slice(end)
fs.writeFileSync(sp, site)
console.log(`  appended to gallery → "${TITLE}" / "${META}"`)
