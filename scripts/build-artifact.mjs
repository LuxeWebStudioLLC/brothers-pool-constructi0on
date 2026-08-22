/**
 * Produces one self-contained HTML file: markup, styles, script and every
 * photograph inlined. No external requests except Google Fonts.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

execFileSync('npx', ['vite', 'build', '--config', 'vite.config.artifact.js'], { stdio: 'inherit' })

const htmlPath = 'dist-single/index.html'
let html = fs.readFileSync(htmlPath, 'utf8')

const mime = (f) => (f.endsWith('.png') ? 'image/png' : 'image/jpeg')
const refs = [...new Set(html.match(/\/img\/[A-Za-z0-9_\-/]+\.(?:jpg|jpeg|png)/g) || [])]

let inlined = 0
let bytes = 0
for (const ref of refs) {
  const file = path.join('public', ref)
  if (!fs.existsSync(file)) {
    console.warn('  MISSING (left as-is):', ref)
    continue
  }
  const b64 = fs.readFileSync(file).toString('base64')
  const uri = `data:${mime(ref)};base64,${b64}`
  html = html.split(ref).join(uri)
  inlined++
  bytes += b64.length
}

fs.writeFileSync(htmlPath, html)
const mb = (fs.statSync(htmlPath).size / 1048576).toFixed(2)
console.log(`\ninlined ${inlined}/${refs.length} images`)
console.log(`final single file: ${mb} MB`)
if (fs.statSync(htmlPath).size > 16 * 1048576) {
  console.error('OVER THE 16 MB LIMIT — compress further before publishing.')
  process.exit(1)
}
