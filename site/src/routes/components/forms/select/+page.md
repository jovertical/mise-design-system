---
title: Select
description: One choice from a list, in a trigger that opens it.
section: Forms
order: 9
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Pass `items` (`{ value, label }[]`) to `Select` so the closed trigger can show the chosen label: the list, and so its labels, only render while it is open.

## Anatomy

<Anatomy example={examples.anatomy} size="lg" parts={[
  { slot: 'select-trigger', label: 'Trigger', part: 'SelectTrigger', placement: 'left' },
  { slot: 'select-value', label: 'Value', part: 'SelectValue', placement: 'top' },
  { slot: 'select-content', label: 'List', part: 'SelectContent', placement: 'bottom' },
  { slot: 'select-label', label: 'Group label', part: 'SelectLabel', placement: 'left' },
  { slot: 'select-item', label: 'Item', part: 'SelectItem', placement: 'left' },
  { slot: 'select-item-indicator', label: 'Selected mark', placement: 'right' },
  { slot: 'select-separator', label: 'Separator', part: 'SelectSeparator', placement: 'right' },
]} />

## Examples

### In a field

In a form a select sits in a `Field` like any input. `SelectTrigger` is full width by default, matching the inputs beside it; its `id` is what the label points at.

<Preview example={examples['in-a-field']} />

### Groups

`SelectGroup` with a `SelectLabel` names a run of items; `SelectSeparator` divides runs.

<Preview example={examples.groups} />

### Sizes

`size="sm"` on the trigger for a select in a dense row: a table cell, a toolbar.

<Preview example={examples.sizes} />

### Disabled

`disabled` on `Select` locks it; on a `SelectItem`, it leaves that choice visible but unpickable.

<Preview example={examples.disabled} />

## When to use

A select is one choice from many. For two to five choices worth seeing at once, use `RadioGroup`; for a long list someone will search, or for several values, use `Combobox`.

## API reference

<ApiTable component="Select" />

## Keyboard

| Key | Does |
| --- | --- |
| `Space`, `Enter`, `ArrowDown` | Opens the list |
| `ArrowUp`, `ArrowDown` | Moves through the items |
| A letter | Jumps to the next item starting with it |
| `Enter` | Picks the highlighted item and closes |
| `Esc` | Closes without picking |
