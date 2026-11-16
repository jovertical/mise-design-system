---
title: Calendar
description: A month of days on the page, picking one date or a range.
section: Forms
order: 20
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Values are `@internationalized/date` dates (`CalendarDate`), which an app adds itself: `pnpm add @internationalized/date`. In a form, the calendar usually sits behind a `DatePicker`'s trigger.

## Anatomy

<Anatomy example={examples.anatomy} size="lg" parts={[
  { slot: 'calendar', label: 'Calendar', part: 'Calendar', placement: 'left' },
  { selector: '[data-calendar-header]', label: 'Header', placement: 'top' },
  { selector: '[data-calendar-prev-button]', label: 'Previous month', placement: 'left' },
  { selector: '[data-calendar-next-button]', label: 'Next month', placement: 'right' },
  { selector: '[data-selected]', label: 'Selected day', placement: 'right' },
  { selector: '[data-calendar-head-cell]', label: 'Weekday', placement: 'left' },
  { selector: '[data-calendar-grid]', label: 'Month grid', placement: 'bottom' },
]} />

The parts are bits-ui's, found by its own attributes.

## Examples

### A range

<Preview example={examples.range} />

### Month and year selects

<Preview example={examples.dropdowns} />

## When to use

A date picked on the page itself, where the calendar is the point: a schedule, a booking. In a form, behind a trigger: `DatePicker`. A month: `MonthPicker`.

## API reference

<ApiTable component="Calendar" />

## Keyboard

| Key | Does |
| --- | --- |
| Arrow keys | Move a day, or a week up and down |
| `PageUp`, `PageDown` | Move a month |
| `Home`, `End` | Move to the start or end of the week |
| `Enter`, `Space` | Pick the focused day |
