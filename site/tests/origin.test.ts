// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { miseApi } from '../vite/mise-api.js'
import { originOf } from '../vite/origin.js'

describe('originOf', () => {
  it('is shadcn when the Origin line descends from shadcn/ui', () => {
    const source = `<!--
  Origin: the React package 2.23.0 \`badge.tsx\`, itself shadcn/ui new-york \`badge\`
  Diverged: none.
-->`

    expect(originOf(source)).toBe('shadcn')
  })

  it('is mise for a component mise authored or one ported from the React package alone', () => {
    expect(originOf('<!--\n  Origin: mise\n-->')).toBe('mise')

    expect(originOf('<!--\n  Origin: the React package 2.23.0 `stat-tile.tsx`\n-->')).toBe('mise')
  })

  it('reads a TypeScript header the same way', () => {
    expect(originOf('/**\n * Origin: shadcn/ui new-york `sonner`\n */')).toBe('shadcn')
  })
})

describe('the mise-api plugin', () => {
  it('serves each folder with its origin', async () => {
    const plugin = miseApi()
    const load = plugin.load as (id: string) => string
    const source = load('\0virtual:mise-api').replace(/^export default /, '')
    const docs: { folder: string; origin: string }[] = JSON.parse(source)
    const originOfFolder = (folder: string) => docs.find((doc) => doc.folder === folder)?.origin

    expect(originOfFolder('badge')).toBe('shadcn')

    expect(originOfFolder('board')).toBe('mise')
  })
})
