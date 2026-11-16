/**
 * Lays the two builds out as Pages serves them: the docs at the root, the
 * demo under demo/ with its single-page shell also as demo/index.html (its
 * build has only 404.html, and /demo/ itself must load), and the docs'
 * not-found page as the root 404.html, which Pages serves for any miss.
 */
import { copyFileSync, cpSync, existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const site = join(import.meta.dirname, '..', 'build')
const demo = join(import.meta.dirname, '..', '..', 'examples', 'logistics', 'build')

for (const required of [join(site, 'not-found.html'), join(demo, '404.html')]) {
  if (!existsSync(required)) throw new Error(`Missing ${required}; run pnpm build:pages`)
}

rmSync(join(site, 'demo'), { recursive: true, force: true })

cpSync(demo, join(site, 'demo'), { recursive: true })

copyFileSync(join(site, 'demo', '404.html'), join(site, 'demo', 'index.html'))

copyFileSync(join(site, 'not-found.html'), join(site, '404.html'))

console.log('site/build: the docs, demo/ and 404.html')
