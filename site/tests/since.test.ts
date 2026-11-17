// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { compareVersions, firstReleases } from '../scripts/since-walk.js'

describe('firstReleases', () => {
  it('names the first release each folder appears in, whatever order the tags come in', () => {
    expect(
      firstReleases([
        { version: '1.6.0', folders: ['badge', 'board', 'month-picker'] },
        { version: '1.0.0', folders: ['badge'] },
        { version: '1.2.0', folders: ['badge', 'board'] },
      ]),
    ).toEqual({ badge: '1.0.0', board: '1.2.0', 'month-picker': '1.6.0' })
  })
})

describe('compareVersions', () => {
  it('orders by number, not by text', () => {
    expect(['1.10.0', '1.2.0', '1.9.1'].toSorted(compareVersions)).toEqual([
      '1.2.0',
      '1.9.1',
      '1.10.0',
    ])
  })
})
