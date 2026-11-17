import { describe, expect, it } from 'vitest'

import { isNew, sinceOf } from '../src/modules/docs/data/tags.js'

describe('sinceOf', () => {
  it('is the release a folder arrived in, or null before its first release', () => {
    const releases = { badge: '1.0.0' }

    expect(sinceOf('badge', releases)).toBe('1.0.0')

    expect(sinceOf('brand-new', releases)).toBeNull()
  })
})

describe('isNew', () => {
  it('is new in the current minor, or unreleased', () => {
    expect(isNew('1.8.0', '1.8.2')).toBe(true)

    expect(isNew(null, '1.8.2')).toBe(true)
  })

  it('is not new from an earlier minor', () => {
    expect(isNew('1.7.0', '1.8.0')).toBe(false)

    expect(isNew('0.8.0', '1.8.0')).toBe(false)
  })
})
