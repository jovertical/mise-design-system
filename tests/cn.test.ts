import { describe, expect, it } from 'vitest'

import { cn } from '../src/lib/utils/cn.js'

describe('cn', () => {
  it('lets a later utility beat an earlier one in the same group', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('drops falsy values and flattens arrays and objects', () => {
    expect(cn('a', false, null, undefined, ['b', { c: true, d: false }])).toBe('a b c')
  })
})
