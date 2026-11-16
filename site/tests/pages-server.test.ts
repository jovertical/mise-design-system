// @vitest-environment node
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { beforeAll, describe, expect, it } from 'vitest'

import { siteRoutes } from '../scripts/routes.js'
import { BASE, resolveRequest } from '../scripts/serve.js'

const FILES = [
  'index.html',
  '404.html',
  'not-found.html',
  'components/actions/button.html',
  'demo/index.html',
  'demo/404.html',
]

let root = ''

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), 'pages-'))

  mkdirSync(join(root, 'components', 'actions'), { recursive: true })

  mkdirSync(join(root, 'demo'), { recursive: true })

  for (const file of FILES) writeFileSync(join(root, file), file)
})

describe('resolveRequest', () => {
  it('serves a page from its .html file, as Pages does', () => {
    expect(resolveRequest(root, BASE, `${BASE}/components/actions/button`)).toEqual({
      file: join(root, 'components/actions/button.html'),
      status: 200,
    })
  })

  it('serves a folder from its index.html', () => {
    expect(resolveRequest(root, BASE, `${BASE}/demo/?p=%2Forders`).file).toBe(
      join(root, 'demo/index.html'),
    )
  })

  it('serves the root 404.html for anything else, a demo deep link included', () => {
    expect(resolveRequest(root, BASE, `${BASE}/demo/orders/OR-2041`)).toEqual({
      file: join(root, '404.html'),
      status: 404,
    })
  })
})

describe('siteRoutes', () => {
  it('lists the docs pages only', () => {
    expect(siteRoutes(root).toSorted()).toEqual(['/', '/components/actions/button'])
  })
})
