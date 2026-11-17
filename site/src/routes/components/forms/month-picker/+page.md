---
title: MonthPicker
description: A month and its year behind a trigger, for a report or a ledger filtered by month.
section: Forms
order: 22
group: Dates and files
traits: [keyboard, overlay, form control]
keywords: [month, period]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

The value is a `CalendarDate` on the month's first day. The grid opens on the value's year; the arrows move between years.

## Anatomy

<Anatomy example={examples.anatomy} size="lg" parts={[
  { slot: 'month-picker-trigger', label: 'Trigger', placement: 'left' },
  { selector: 'button[aria-label="Previous year"]', label: 'Previous year', placement: 'left' },
  { selector: 'button[aria-label="Next year"]', label: 'Next year', placement: 'right' },
  { slot: 'month-picker-grid', label: 'Month grid', placement: 'bottom' },
  { slot: 'month-picker-month', label: 'Month', placement: 'left' },
]} />

## Examples

### Bounded

<Preview example={examples.bounds} />

### In a report's toolbar

<Preview example={examples['in-a-toolbar']} />

## When to use

A month: a report, a ledger, a payroll run. A day: `DatePicker`. Like DatePicker, it takes a bindable `open` and `contentProps` for its panel.

## API reference

<ApiTable component="MonthPicker" />

## Keyboard

| Key | Does |
| --- | --- |
| Arrow keys | Move across the grid of months |
| `Enter` | Picks the focused month |
| `Esc` | Closes the grid |
