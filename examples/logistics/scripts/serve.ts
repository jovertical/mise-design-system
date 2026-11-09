/**
 * Serves build/ the way GitHub Pages does: a file if it exists, otherwise
 * 404.html, which boots the single-page app on any deep link. For the smoke
 * run and local screenshots; `vite preview` does not reproduce the fallback.
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

export function serve(root: string, port: number): Promise<Server> {
  const server = createServer((request, response) => {
    const path = normalize(decodeURIComponent((request.url ?? '/').split('?')[0]))
    let file = join(root, path)
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html')
    const found = existsSync(file) && statSync(file).isFile()
    const target = found ? file : join(root, '404.html')
    response.writeHead(found ? 200 : 404, {
      'content-type': TYPES[extname(target)] ?? 'application/octet-stream',
    })
    createReadStream(target).pipe(response)
  })
  return new Promise((done) => server.listen(port, () => done(server)))
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.argv[2] ?? 5199)
  await serve(join(import.meta.dirname, '..', 'build'), port)
  console.log(`build/ on http://localhost:${port}`)
}
