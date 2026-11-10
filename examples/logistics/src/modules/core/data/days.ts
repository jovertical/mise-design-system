/**
 * Between the data's day offsets and the calendar dates a DatePicker speaks.
 * Every date in the demo is a whole number of days from DEMO_TODAY.
 */
import { type CalendarDate, type DateValue, parseDate } from '@internationalized/date'

import { DEMO_TODAY } from '#modules/core/utils/format.js'

const today = parseDate(DEMO_TODAY)

export const dayToDate = (offset: number): CalendarDate => today.add({ days: offset })

export const dateToDay = (date: DateValue): number =>
  Math.round(
    (Date.UTC(date.year, date.month - 1, date.day) -
      Date.UTC(today.year, today.month - 1, today.day)) /
      86_400_000,
  )
