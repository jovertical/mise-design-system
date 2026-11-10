// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { compile } from 'mdsvex'
import { describe, expect, it } from 'vitest'

const routes = join(import.meta.dirname, '..', 'src', 'routes')

describe('the home page', () => {
  it('compiles through mdsvex with its frontmatter as metadata', async () => {
    const source = readFileSync(join(routes, '+page.md'), 'utf8')
    const compiled = await compile(source)

    expect(compiled?.code).toContain('export const metadata')

    expect(compiled?.code).toContain('"title":"mise"')
  })
})
