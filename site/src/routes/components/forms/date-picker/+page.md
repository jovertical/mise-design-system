---
title: DatePicker
description: A date, or a range, behind a trigger that sits among a form's inputs.
section: Forms
order: 21
group: Dates and files
traits: [keyboard, overlay, form control]
keywords: [date, calendar, date range]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

`mode` is required: `single` binds a `DateValue`, `range` binds `{ start, end }`. Picking a single date closes the calendar; a range stays open until both ends are picked. The calendar inside is a [Calendar](/components/forms/calendar).

## Anatomy

<Anatomy example={examples.anatomy} size="lg" parts={[
  { slot: 'date-picker-trigger', label: 'Trigger', placement: 'left' },
  { slot: 'popover-content', label: 'Popover', placement: 'right' },
  { slot: 'calendar', label: 'Calendar', placement: 'bottom' },
]} />

## Examples

### A range, from a floor

<Preview example={examples.range} />

### Disabled, invalid, a custom label

<Preview example={examples.states} />

### Opened by the screen

`open` is bindable, so a screen opens the calendar from an action of its own. `contentProps` reaches the popover's panel: its `align`, its portal, its focus and dismissal.

<Preview example={examples['opened-by-the-screen']} />

## When to use

A date in a form. A month, for a report or a ledger: `MonthPicker`. A time of day: `TimePicker`. A calendar that is the point of the page: `Calendar`.

## API reference

<ApiTable component="DatePicker" />

## Keyboard

The trigger opens on `Enter` or `Space`; the calendar takes the keys on the [Calendar](/components/forms/calendar) page; `Esc` closes it.
