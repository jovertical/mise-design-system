/**
 * Origin: the React package 2.23.0 `decimal-input.tsx` (`sanitize`, `parse`, `clamp`, `stepFrom`)
 * Diverged: shared by NumberInput's field and its buttons, and by every
 *   format, where React kept a copy per input. `add` is React's `stepFrom`
 *   without the empty case, which each caller decides.
 */

export type NumberInputFormat = 'integer' | 'decimal' | 'currency'

/** The decimal places a format takes; `undefined` is no limit. */
export const placesFor = (format: NumberInputFormat, precision: number | undefined) =>
  format === 'integer' ? 0 : format === 'currency' ? 2 : precision

export const INPUT_MODE: Record<NumberInputFormat, 'numeric' | 'decimal'> = {
  integer: 'numeric',
  decimal: 'decimal',
  currency: 'decimal',
}

/**
 * Keep what can become a number: digits, one point (unless `places` is 0),
 * and a leading minus when the floor allows one. A comma is a pasted
 * thousands separator, not a decimal point.
 */
export function sanitize(raw: string, allowsNegative: boolean, places: number | undefined): string {
  const isNegative = allowsNegative && raw.trimStart().startsWith('-')
  const [whole = '', ...rest] = raw.replace(/[^\d.]/g, '').split('.')
  const fraction = rest.join('')
  const hasPoint = rest.length > 0 && places !== 0
  const limitedFraction = places === undefined ? fraction : fraction.slice(0, places)

  return `${isNegative ? '-' : ''}${whole}${hasPoint ? `.${limitedFraction}` : ''}`
}

/** A finished number, or `null` for an empty or half-typed one ("-", "."). */
export function parse(text: string): number | null {
  if (text === '' || text === '-' || text === '.' || text === '-.') return null

  const parsed = Number(text)

  return Number.isFinite(parsed) ? parsed : null
}

export function clamp(value: number, min: number, max: number | undefined): number {
  const floored = Math.max(min, value)

  return max === undefined ? floored : Math.min(max, floored)
}

const decimalPlaces = (value: number) => String(value).split('.')[1]?.length ?? 0

/** Rounded to the finer of the two precisions, so 0.1 + 0.2 lands on 0.3. */
export function add(current: number, delta: number): number {
  const places = Math.max(decimalPlaces(current), decimalPlaces(delta))

  return Number((current + delta).toFixed(places))
}
