/**
 * Serves the assembled build the way GitHub Pages serves the repository's
 * site: under the base path, a file if it exists, else `<path>.html`, else
 * `<path>/index.html`, else the root 404.html with a 404. For the smoke run
 * and local review; `vite preview` knows neither the base nor the demo.
 */
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer, type Server } from 'node:http'
import { extname, join, normalize } from 'node:path'

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
}

export const BASE = '/mise-design-system'

type Resolved = { file: string; status: 200 | 404 }

export function resolveRequest(root: string, base: string, url: string): Resolved {
  const notFound: Resolved = { file: join(root, '404.html'), status: 404 }
  const pathname = decodeURIComponent(url.split('?')[0].split('#')[0])

  if (!pathname.startsWith(base)) return notFound

  const path = normalize(pathname.slice(base.length) || '/')
  const candidates = [join(root, path), `${join(root, path)}.html`, join(root, path, 'index.html')]

  const found = candidates.find(
    (candidate) => existsSync(candidate) && statSync(candidate).isFile(),
  )

  return found ? { file: found, status: 200 } : notFound
}

export function serve(root: string, port: number, base = BASE): Promise<Server> {
  const server = createServer((request, response) => {
    const { file, status } = resolveRequest(root, base, request.url ?? '/')

    response.writeHead(status, {
      'content-type': TYPES[extname(file)] ?? 'application/octet-stream',
    })

    createReadStream(file).pipe(response)
  })

  return new Promise((done) => server.listen(port, () => done(server)))
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.argv[2] ?? 5191)

  await serve(join(import.meta.dirname, '..', 'build'), port)

  console.log(`site/build on http://localhost:${port}${BASE}/`)
}
