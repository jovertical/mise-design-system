import { describe, expect, it } from 'vitest'

import { docsPages, navSections, SECTIONS, withHrefs } from '../src/modules/nav/data/navigation.js'

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

/** A section split into sub-groups, listed out of order, with the overview page. */
const grouped = {
  '/src/routes/components/+page.md': { title: 'Components' },
  '/src/routes/components/forms/select/+page.md': {
    title: 'Select',
    section: 'Forms',
    order: 9,
    group: 'Choices',
  },
  '/src/routes/components/forms/input/+page.md': {
    title: 'Input',
    section: 'Forms',
    order: 3,
    group: 'Text input',
  },
  '/src/routes/components/forms/field/+page.md': {
    title: 'Field',
    section: 'Forms',
    order: 1,
    group: 'Fields',
  },
}

describe('navSections', () => {
  it('lists the guides flat, then folds the components into a group per section', () => {
    expect(navSections(docsPages(modules))).toEqual([
      {
        label: 'Getting started',
        items: [
          { label: 'Installation', href: '/getting-started/installation' },
          { label: 'Theming', href: '/getting-started/theming' },
        ],
      },
      {
        label: 'Components',
        items: [
          { label: 'Actions', items: [{ label: 'Button', href: '/components/actions/button' }] },
        ],
      },
    ])
  })

  it('heads each sub-group in its section, in SUB_GROUPS order, and leads with the overview', () => {
    expect(navSections(docsPages(grouped))).toEqual([
      {
        label: 'Components',
        items: [
          { label: 'Overview', href: '/components' },
          {
            label: 'Forms',
            items: [
              { heading: 'Fields' },
              { label: 'Field', href: '/components/forms/field' },
              { heading: 'Text input' },
              { label: 'Input', href: '/components/forms/input' },
              { heading: 'Choices' },
              { label: 'Select', href: '/components/forms/select' },
            ],
          },
        ],
      },
    ])
  })
})

describe('withHrefs', () => {
  it('rewrites every href, inside groups too, and leaves headings alone', () => {
    const sections = withHrefs(
      [
        {
          label: 'Components',
          items: [
            { label: 'Overview', href: '/components' },
            { label: 'Forms', items: [{ heading: 'Fields' }, { label: 'Field', href: '/f' }] },
          ],
        },
      ],
      (href) => `/base${href}`,
    )

    expect(sections[0].items).toEqual([
      { label: 'Overview', href: '/base/components' },
      { label: 'Forms', items: [{ heading: 'Fields' }, { label: 'Field', href: '/base/f' }] },
    ])
  })
})

describe('SECTIONS', () => {
  it('starts with the guides, then follows the component groups', () => {
    expect(SECTIONS.slice(0, 3)).toEqual(['Getting started', 'Foundations', 'Typography'])
  })
})
