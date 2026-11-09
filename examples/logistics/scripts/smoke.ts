/**
 * Opens every route of the built app in light and dark with a headless
 * Chromium, as GitHub Pages would serve it (scripts/serve.ts), and fails when a
 * route renders no content, renders SvelteKit's error page, or a not-found
 * route renders anything but ErrorState. Writes .smoke/<route>-<scheme>.png.
 *
 * Limit: --dump-dom cannot see console errors or uncaught exceptions; that
 * needs puppeteer or Playwright as a dependency.
 *
 * CHROME overrides the browser; the default is Playwright's headless shell.
 */
import { execFile } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { NOT_FOUND_ROUTES, ROUTES } from './routes.js'
import { serve } from './serve.js'

const PORT = 5199
const root = join(import.meta.dirname, '..')
const out = join(root, '.smoke')
const chrome =
  process.env.CHROME ??
  join(
    homedir(),
    'Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell',
  )

const flags = [
  '--headless',
  '--disable-gpu',
  '--hide-scrollbars',
  // Without it a screenshot can catch an overlay mid fade-in, half transparent.
  '--run-all-compositor-stages-before-draw',
  '--virtual-time-budget=8000',
]

const slug = (route: string) => (route === '/' ? 'home' : route.slice(1).replace(/[/?=&]/g, '-'))

const run = promisify(execFile)

/**
 * Async on purpose: the static server runs in this process, and a blocking
 * child call would stop it answering the browser.
 */
async function open(url: string, screenshot: string): Promise<string> {
  const size = '--window-size=1440,1000'
  await run(chrome, [...flags, size, `--screenshot=${screenshot}`, url])
  const { stdout } = await run(chrome, [...flags, size, '--dump-dom', url], {
    maxBuffer: 64 * 1024 * 1024,
  })
  return stdout
}

function verdict(route: string, dom: string): string | null {
  const main = dom.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? ''
  if (!main.replace(/<[^>]+>/g, '').trim()) return 'empty <main>'
  if (/data-sveltekit-error|Internal Error/.test(dom)) return "SvelteKit's error page"
  const isNotFound = NOT_FOUND_ROUTES.includes(route)
  const hasErrorState = /data-slot="error-state"|data-slot="empty"/.test(main)
  if (isNotFound && !hasErrorState) return 'expected ErrorState'
  return null
}

mkdirSync(out, { recursive: true })
const server = await serve(join(root, 'build'), PORT)
const failures: string[] = []

for (const route of [...ROUTES, ...NOT_FOUND_ROUTES]) {
  for (const scheme of ['light', 'dark'] as const) {
    const separator = route.includes('?') ? '&' : '?'
    const url = `http://localhost:${PORT}${route}${separator}scheme=${scheme}`
    const dom = await open(url, join(out, `${slug(route)}-${scheme}.png`))
    const problem = verdict(route, dom)
    console.log(`${problem ? '✗' : '✓'} ${route} (${scheme})${problem ? `: ${problem}` : ''}`)
    if (problem) failures.push(`${route} (${scheme}): ${problem}`)
  }
}

server.close()
console.log(failures.length ? `\n${failures.length} failed` : '\nAll routes rendered.')
process.exit(failures.length ? 1 : 0)
