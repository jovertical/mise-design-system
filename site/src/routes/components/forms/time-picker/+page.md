---
title: TimePicker
description: A time of day, as an hour and a minute, with AM and PM on a 12-hour clock.
section: Forms
order: 23
group: Dates and files
traits: [overlay, form control]
keywords: [time, hour, clock]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Its value is an `@internationalized/date` `Time`. A partial pick fills the rest from 12:00 AM; an empty picker binds `undefined`.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'time-picker', label: 'Time picker', part: 'TimePicker', placement: 'top' },
  { selector: '[aria-label="Hour"]', label: 'Hour', placement: 'left' },
  { selector: '[aria-label="Minute"]', label: 'Minute', placement: 'bottom' },
  { selector: '[aria-label="AM or PM"]', label: 'Period', placement: 'right' },
]} />

Each part is a `Select`, so each opens its own list.

## Examples

### 12-hour, 24-hour, every 15 minutes

<Preview example={examples.formats} />

### In a field

<Preview example={examples['in-a-field']} />

## When to use

A time of day: a shift boundary, a cut-off, an opening hour. A date and a time together: a `DatePicker` and a `TimePicker` side by side.

## API reference

<ApiTable component="TimePicker" />
