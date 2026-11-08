import { addons } from 'storybook/manager-api'
import type { TagBadgeParameters } from 'storybook-addon-tag-badges/manager-helpers'

/**
 * One badge: `shadcn`, on components whose React origin is shadcn/ui. The tag
 * itself is checked against each component's `Origin:` header by
 * tests/provenance.test.ts; this only makes it visible. `mise` is left
 * unbadged, and the addon's default badges are left out, so `autodocs` and the
 * like never show.
 */
const tagBadges: TagBadgeParameters = [
  {
    tags: 'shadcn',
    badge: { text: 'shadcn', style: 'grey', tooltip: 'Ported from shadcn/ui' },
    display: { sidebar: [{ type: 'component', skipInherited: true }], toolbar: true, mdx: true },
  },
]

addons.setConfig({ tagBadges })
