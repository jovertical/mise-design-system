/** Every docs page in a build, as a path without the base, from its .html files. */
import { readdirSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const SKIPPED = new Set(['404.html', 'not-found.html'])

export function siteRoutes(build: string): string[] {
  return htmlFiles(build)
    .map((file) => relative(build, file).split(sep).join('/'))
    .filter((file) => !file.startsWith('demo/') && !SKIPPED.has(file))
    .map((file) => (file === 'index.html' ? '/' : `/${file.replace(/(\/index)?\.html$/, '')}`))
}

function htmlFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)

    if (entry.isDirectory()) return htmlFiles(path)

    return entry.name.endsWith('.html') ? [path] : []
  })
}
