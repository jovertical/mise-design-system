import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

const root = join(import.meta.dirname, '..')
const bin = join(root, 'node_modules/@jovertical/mise-design-system/bin/mise-theme.js')

describe('the theme', () => {
  it('is current; run pnpm theme if not', () => {
    mkdirSync(join(root, '.smoke'), { recursive: true })
    execFileSync('node', [bin, 'mise.theme.js', '-o', '.smoke/theme.css'], { cwd: root })
    const generated = readFileSync(join(root, '.smoke/theme.css'), 'utf8')
    const committed = readFileSync(join(root, 'src/mise-theme.css'), 'utf8')
    expect(committed).toContain('--color-primary-600')
    expect(committed).toBe(generated)
  })
})
