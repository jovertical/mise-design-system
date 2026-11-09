/**
 * What an agent needs to know about the app it is working in before it writes
 * mise UI: which version, which stack, where the theme and the stylesheet are.
 * Read-only. The consumer skill runs it on load through `mise-theme info --json`.
 */
import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

export type ProjectInfo = {
  version: string
  stack: 'sveltekit' | 'inertia' | 'vite'
  svelte: string | null
  tailwind: string | null
  themeConfig: string | null
  stylesheet: string | null
  form: boolean
}

const THEME_CONFIGS = ['mise.theme.js', 'mise.theme.mjs', 'mise.theme.ts']
const SKIPPED = new Set([
  'node_modules',
  '.git',
  'vendor',
  'dist',
  'build',
  '.svelte-kit',
  'storage',
  'public',
])
const IMPORT = /@import\s+['"]@jovertical\/mise-design-system\//
const MAX_DEPTH = 6

async function findStylesheet(cwd: string, dir = cwd, depth = 0): Promise<string | null> {
  if (depth > MAX_DEPTH) return null
  const entries = (await readdir(dir, { withFileTypes: true })).sort((a, b) =>
    a.name.localeCompare(b.name),
  )
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (
      entry.isFile() &&
      entry.name.endsWith('.css') &&
      IMPORT.test(await readFile(path, 'utf8'))
    ) {
      return relative(cwd, path).split('\\').join('/')
    }
  }
  for (const entry of entries) {
    if (!entry.isDirectory() || SKIPPED.has(entry.name) || entry.name.startsWith('.')) continue
    const found = await findStylesheet(cwd, join(dir, entry.name), depth + 1)
    if (found) return found
  }
  return null
}

export async function projectInfo(cwd: string, version: string): Promise<ProjectInfo> {
  const manifestPath = join(cwd, 'package.json')
  if (!existsSync(manifestPath)) throw new Error(`No package.json in ${cwd}`)
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  const dependencies: Record<string, string> = {
    ...manifest.dependencies,
    ...manifest.devDependencies,
  }
  const has = (name: string) => name in dependencies

  return {
    version,
    stack: has('@sveltejs/kit') ? 'sveltekit' : has('@inertiajs/svelte') ? 'inertia' : 'vite',
    svelte: dependencies.svelte ?? null,
    tailwind: dependencies.tailwindcss ?? null,
    themeConfig: THEME_CONFIGS.find((name) => existsSync(join(cwd, name))) ?? null,
    stylesheet: await findStylesheet(cwd),
    form: has('formsnap') && has('sveltekit-superforms'),
  }
}
