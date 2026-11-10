/**
 * Origin: mise
 * Diverged: none. The pure parts of MonthPicker: its month names, its label and
 *   which months its bounds allow, kept apart so they are tested without a DOM.
 */
import { CalendarDate, type DateValue } from '@internationalized/date'

/** The twelve months' short names in `locale`, January first. */
export function shortMonthNames(locale: string): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' })

  return Array.from({ length: 12 }, (_, index) =>
    formatter.format(new Date(Date.UTC(2026, index, 1))),
  )
}

/** "March 2026" in `locale`: the trigger's text when the caller gives no `formatLabel`. */
export function longMonthLabel(value: DateValue, locale: string): string {
  const formatter = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

  return formatter.format(new Date(Date.UTC(value.year, value.month - 1, 1)))
}

/** The month's first day, the value a picked month always reports. */
export function firstOfMonth(year: number, month: number): CalendarDate {
  return new CalendarDate(year, month, 1)
}

/** Whether a month falls outside `[minValue, maxValue]`, compared by month, not day. */
export function isMonthOutside(
  year: number,
  month: number,
  minValue?: DateValue,
  maxValue?: DateValue,
): boolean {
  const key = year * 12 + month

  if (minValue && key < minValue.year * 12 + minValue.month) return true

  return Boolean(maxValue && key > maxValue.year * 12 + maxValue.month)
}
