import { describe, expect, it } from 'vitest'

import type { DocsPage } from '../src/modules/nav/data/navigation.js'
import {
  type ComponentEntry,
  componentEntries,
  sectionsOf,
} from '../src/modules/overview/data/entries.js'
import { filterEntries, overviewHref, tagsFrom } from '../src/modules/overview/utils/filter.js'

const pages: DocsPage[] = [
  {
    title: 'Select',
    description: 'One option from a list.',
    section: 'Forms',
    order: 9,
    group: 'Choices',
    traits: ['keyboard', 'overlay', 'form control'],
    keywords: ['dropdown'],
    href: '/components/forms/select',
  },
  {
    title: 'Input',
    description: 'A single-line text field.',
    section: 'Forms',
    order: 3,
    group: 'Text input',
    traits: ['form control'],
    href: '/components/forms/input',
  },
  {
    title: 'Board',
    description: 'Columns of cards.',
    section: 'Data display',
    order: 21,
    group: 'Workflows',
    traits: ['keyboard', 'draggable'],
    keywords: ['kanban'],
    href: '/components/data-display/board',
  },
  { title: 'Installation', section: 'Getting started', href: '/getting-started/installation' },
]

const docs = [
  { folder: 'select', origin: 'shadcn' as const },
  { folder: 'input', origin: 'shadcn' as const },
  { folder: 'board', origin: 'mise' as const },
]

const entries = componentEntries(pages, docs, { select: '1.0.0', input: '1.0.0' }, '1.8.0')

const titles = (list: ComponentEntry[]) => list.map((entry) => entry.title)

describe('componentEntries', () => {
  it('joins a component page with its origin and release, and leaves the guides out', () => {
    expect(entries.find((entry) => entry.title === 'Select')).toMatchObject({
      origin: 'shadcn',
      since: '1.0.0',
      isNew: false,
    })

    expect(entries.find((entry) => entry.title === 'Board')).toMatchObject({
      origin: 'mise',
      since: null,
      isNew: true,
    })

    expect(titles(entries)).not.toContain('Installation')
  })
})

describe('sectionsOf', () => {
  it('orders by section, then sub-group, then the page order', () => {
    expect(
      sectionsOf(entries).map((section) => ({
        section: section.section,
        groups: section.groups.map((group) => [group.group, titles(group.entries)]),
      })),
    ).toEqual([
      {
        section: 'Forms',
        groups: [
          ['Text input', ['Input']],
          ['Choices', ['Select']],
        ],
      },
      { section: 'Data display', groups: [['Workflows', ['Board']]] },
    ])
  })
})

describe('filterEntries', () => {
  it('keeps entries carrying every chosen tag', () => {
    expect(titles(filterEntries(entries, '', ['keyboard']))).toEqual(['Select', 'Board'])

    expect(titles(filterEntries(entries, '', ['keyboard', 'shadcn']))).toEqual(['Select'])

    expect(titles(filterEntries(entries, '', ['new']))).toEqual(['Board'])
  })

  it('matches the query against words, sub-group and keywords, in any case', () => {
    expect(titles(filterEntries(entries, 'KANBAN', []))).toEqual(['Board'])

    expect(titles(filterEntries(entries, 'text input', []))).toEqual(['Input'])
  })
})

describe('tagsFrom', () => {
  it('reads the known tags from a query string and drops the rest', () => {
    expect(tagsFrom(new URLSearchParams('tag=keyboard&tag=form%20control&tag=nope'))).toEqual([
      'keyboard',
      'form control',
    ])
  })
})

describe('overviewHref', () => {
  it('links to the overview filtered by one tag', () => {
    expect(overviewHref('form control')).toBe('/components?tag=form%20control')
  })
})
