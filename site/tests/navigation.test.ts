import { describe, expect, it } from 'vitest'

import { docsPages, navSections, SECTIONS } from '../src/modules/nav/data/navigation.js'

const modules = {
  '/src/routes/+page.md': { title: 'mise' },
  '/src/routes/components/actions/button/+page.md': {
    title: 'Button',
    section: 'Actions',
    order: 1,
  },
  '/src/routes/getting-started/theming/+page.md': {
    title: 'Theming',
    section: 'Getting started',
    order: 2,
  },
  '/src/routes/getting-started/installation/+page.md': {
    title: 'Installation',
    section: 'Getting started',
    order: 1,
  },
}

describe('docsPages', () => {
  it('turns route files into hrefs', () => {
    expect(docsPages(modules).map((page) => page.href)).toEqual([
      '/',
      '/components/actions/button',
      '/getting-started/theming',
      '/getting-started/installation',
    ])
  })
})

describe('navSections', () => {
  it('groups pages by section in SECTIONS order, ordered within, without the home page', () => {
    expect(navSections(docsPages(modules))).toEqual([
      {
        label: 'Getting started',
        items: [
          { label: 'Installation', href: '/getting-started/installation' },
          { label: 'Theming', href: '/getting-started/theming' },
        ],
      },
      { label: 'Actions', items: [{ label: 'Button', href: '/components/actions/button' }] },
    ])
  })

  it('starts with the guides, then follows the component groups', () => {
    expect(SECTIONS.slice(0, 3)).toEqual(['Getting started', 'Foundations', 'Typography'])
  })
})
