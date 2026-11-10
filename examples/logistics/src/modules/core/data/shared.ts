/** Helpers the repositories share. Every repository takes the store first. */
import type { ReadinessItem } from '@jovertical/mise-design-system'
import { z } from 'zod'

import type { Dataset } from './types.js'

export type Source = { data: Dataset }

export const matches = (search: string | undefined, ...fields: string[]) =>
  !search || fields.some((field) => field.toLowerCase().includes(search.trim().toLowerCase()))

/** A whole-number percentage, 0 when there is nothing to divide by. */
export const percent = (part: number, whole: number) =>
  whole ? Math.round((part / whole) * 100) : 0

/** Counts and shares for each key, in the keys' order. */
export function tally<K extends string>(keys: readonly K[], values: K[]) {
  const total = values.length

  return Object.fromEntries(
    keys.map((key) => {
      const count = values.filter((value) => value === key).length

      return [key, { count, share: percent(count, total) }]
    }),
  ) as Record<K, { count: number; share: number }>
}

/** Money in a schema: whole cents, never negative. */
export const cents = z.number().int('Whole cents only').min(0, 'Cannot be negative')

/** One row of a readiness checklist: met or not. */
export const readinessRow = (id: string, label: string, met: boolean): ReadinessItem => ({
  id,
  label,
  status: met ? 'met' : 'unmet',
})
