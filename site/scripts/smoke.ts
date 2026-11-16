/**
 * Opens the assembled Pages build (`pnpm build:pages`) as Pages would serve it
 * (scripts/serve.ts) with a headless Chromium: every docs page in light and
 * dark, an address that is no page, and a demo deep link through the 404
 * redirect. Fails on an empty page, an error page, or an anatomy not fully
 * drawn. Writes .smoke/<route>-<scheme>.png. Modelled on the logistics
 * example's smoke run; CHROME overrides the browser.
 */
import { execFile } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { siteRoutes } from './routes.js'
import { BASE, serve } from './serve.js'
import { demoVerdict, notFoundVerdict, pageVerdict } from './smoke-verdicts.js'

const PORT = 5198
const root = join(import.meta.dirname, '..')
const build = join(root, 'build')
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
  '--run-all-compositor-stages-before-draw',
  '--virtual-time-budget=8000',
  '--window-size=1440,1000',
]

const run = promisify(execFile)
const slug = (route: string) => (route === '/' ? 'home' : route.slice(1).replace(/[/?=&]/g, '-'))

type Check = { route: string; scheme: string; verdict: (dom: string) => string | null }

/** Async on purpose: the server runs in this process and must keep answering. */
async function open(check: Check): Promise<string> {
  const url = `http://localhost:${PORT}${BASE}${check.route}?scheme=${check.scheme}`

  await run(chrome, [
    ...flags,
    `--screenshot=${join(out, `${slug(check.route)}-${check.scheme}.png`)}`,
    url,
  ])

  const { stdout } = await run(chrome, [...flags, '--dump-dom', url], {
    maxBuffer: 64 * 1024 * 1024,
  })

  return stdout
}

const checks: Check[] = [
  ...siteRoutes(build).flatMap((route) =>
    ['light', 'dark'].map((scheme) => ({ route, scheme, verdict: pageVerdict })),
  ),
  { route: '/nope', scheme: 'light', verdict: notFoundVerdict },
  { route: '/demo/orders/OR-2041', scheme: 'light', verdict: demoVerdict },
]

mkdirSync(out, { recursive: true })

const server = await serve(build, PORT)
const failures: string[] = []

for (const check of checks) {
  const problem = check.verdict(await open(check))
  const label = `${check.route} (${check.scheme})`

  console.log(`${problem ? '✗' : '✓'} ${label}${problem ? `: ${problem}` : ''}`)

  if (problem) failures.push(`${label}: ${problem}`)
}

server.close()

console.log(failures.length ? `\n${failures.length} failed` : '\nAll routes rendered.')

process.exit(failures.length ? 1 : 0)
