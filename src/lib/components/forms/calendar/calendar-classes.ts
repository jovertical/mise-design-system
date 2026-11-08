/**
 * Origin: the React package 2.23.0 `calendar.tsx` (`classNames`, `CalendarDayButton`)
 * Diverged: React's react-day-picker class map, keyed by the bits-ui part each
 *   lands on, and shared by Calendar and RangeCalendar so the two cannot
 *   drift. react-day-picker's `data-*` modifiers become bits-ui's
 *   (`data-selected`, `data-today`, `data-outside-month`, `data-range-*`).
 *   React's `bg-accent`, which the React package redefined as the brand tint,
 *   is `bg-muted` for today and the range's span, as shadcn's neutral accent
 *   is. The day is a ghost square button, as React's CalendarDayButton was.
 */
import { buttonVariants } from '../../actions/button/button-variants.js'

export type CalendarCaptionLayout = 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years'

const navButton = `${buttonVariants({ variant: 'ghost' })} size-(--cell-size) p-0 select-none disabled:opacity-50 aria-disabled:opacity-50`

export const CALENDAR_CLASS = {
  root: 'bg-background group/calendar w-fit p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent',
  months: 'relative flex flex-col gap-4 md:flex-row',
  month: 'flex w-full flex-col gap-4',
  nav: 'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
  navButton,
  header: 'flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)',
  captionLabel: 'select-none text-sm font-medium',
  dropdowns: 'flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium',
  dropdownRoot:
    'relative rounded-md border border-input shadow-xs has-focus:border-ring has-focus:ring-[3px] has-focus:ring-ring/50',
  dropdown: 'absolute inset-0 bg-popover opacity-0',
  dropdownLabel:
    'flex h-8 select-none items-center gap-1 rounded-md pr-1 pl-2 text-sm font-medium [&>svg]:size-3.5 [&>svg]:text-muted-foreground',
  grid: 'w-full border-collapse',
  weekdays: 'flex',
  weekday: 'text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal',
  week: 'mt-2 flex w-full',
  cell: 'group/day relative aspect-square h-full w-full select-none p-0 text-center',
  // The row's ends round a span off at the week's edge. Range only: on a single
  // day they squared one side of the selected pill in the first and last column.
  rangeCell:
    '[&:first-child[data-selected]_[data-bits-day]]:rounded-l-md [&:last-child[data-selected]_[data-bits-day]]:rounded-r-md [&:has([data-range-start])]:bg-muted [&:has([data-range-start])]:rounded-l-md [&:has([data-range-middle])]:bg-muted [&:has([data-range-middle])]:rounded-none [&:has([data-range-end])]:bg-muted [&:has([data-range-end])]:rounded-r-md',
  day: `${buttonVariants({ variant: 'ghost', iconOnly: true })} flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal [&>span]:text-xs [&>span]:opacity-70 focus-visible:relative focus-visible:z-10 [&[data-today]:not([data-selected])]:bg-muted [&[data-today]:not([data-selected])]:text-foreground [&[data-outside-month]:not([data-selected])]:text-muted-foreground data-[disabled]:pointer-events-none data-[disabled]:text-muted-foreground data-[disabled]:opacity-50 data-[unavailable]:text-muted-foreground data-[unavailable]:line-through`,
  singleDay: 'data-[selected]:bg-primary data-[selected]:text-primary-foreground',
  rangeDay:
    'data-[range-start]:bg-primary data-[range-start]:text-primary-foreground data-[range-start]:rounded-md data-[range-start]:rounded-l-md data-[range-end]:bg-primary data-[range-end]:text-primary-foreground data-[range-end]:rounded-md data-[range-end]:rounded-r-md data-[range-middle]:bg-muted data-[range-middle]:text-foreground data-[range-middle]:rounded-none data-[selection-start]:bg-primary data-[selection-start]:text-primary-foreground',
} as const
