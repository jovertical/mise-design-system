// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { exampleModuleSource } from '../vite/examples.js'
import { highlightCode } from '../vite/highlight.js'
import { baseLinks, headingIds, slugOf } from '../vite/markdown.js'

type MarkdownNode = {
  type: string
  url?: string
  depth?: number
  value?: string
  data?: { hProperties?: Record<string, string> }
  children?: MarkdownNode[]
}

describe('exampleModuleSource', () => {
  it('imports each example and exports it with its source and highlighted html', () => {
    const code = exampleModuleSource([
      { name: 'basic', path: '/abs/basic.svelte', source: '<Button />', html: '<pre>x</pre>' },
    ])

    expect(code).toContain('import example0 from "/abs/basic.svelte"')

    expect(code).toContain(
      '"basic": { component: example0, source: "<Button />", html: "<pre>x</pre>" }',
    )
  })
})

describe('highlightCode', () => {
  it('emits Shiki html coloured by css variables, not fixed colours', async () => {
    const html = await highlightCode("const order = 'OR-2041'", 'ts')

    expect(html).toContain('<pre class="shiki')

    expect(html).toContain('var(--shiki-')

    expect(html).not.toMatch(/color:#[0-9a-f]{3,6}/i)
  })

  it('falls back to plain text for an unknown language', async () => {
    expect(await highlightCode('anything', 'cobol')).toContain('anything')
  })
})

describe('the remark plugins', () => {
  it('puts the base path on root-relative links only', () => {
    const tree: MarkdownNode = {
      type: 'root',
      children: [
        { type: 'link', url: '/getting-started/theming' },
        { type: 'link', url: 'https://github.com' },
        { type: 'link', url: '#anatomy' },
      ],
    }

    baseLinks('/mise-design-system')()(tree)

    expect(tree.children?.map((node) => node.url)).toEqual([
      '/mise-design-system/getting-started/theming',
      'https://github.com',
      '#anatomy',
    ])
  })

  it('gives h2 and h3 an id from their text', () => {
    const heading: MarkdownNode = {
      type: 'heading',
      depth: 2,
      children: [{ type: 'text', value: 'API reference' }],
    }

    headingIds()()({ type: 'root', children: [heading] })

    expect(heading.data?.hProperties?.id).toBe('api-reference')
  })

  it('slugs text the same way everywhere', () => {
    expect(slugOf('With a form & a footer')).toBe('with-a-form-a-footer')
  })
})
