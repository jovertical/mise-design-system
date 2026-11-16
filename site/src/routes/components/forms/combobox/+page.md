---
title: Combobox
description: "A searchable list: one value, several as chips, or free text with suggestions."
section: Forms
order: 19
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

bits-ui does not filter the list: keep the typed text from the input's `oninput` and render only the items that match. Pass `items` so the field shows the chosen label while the list is closed.

## Anatomy

<Anatomy example={examples.anatomy} size="lg" parts={[
  { selector: '[data-slot="input-group"]', label: 'Field', part: 'ComboboxInput', placement: 'left' },
  { slot: 'combobox-clear', label: 'Clear', placement: 'top' },
  { slot: 'combobox-content', label: 'List', part: 'ComboboxContent', placement: 'bottom' },
  { slot: 'combobox-item', label: 'Item', part: 'ComboboxItem', placement: 'left' },
  { slot: 'combobox-item-indicator', label: 'Selected mark', placement: 'right' },
]} />

## Examples

### Several values, as chips

<Preview example={examples.chips} />

### Free text with suggestions

<Preview example={examples['free-text']} />

## When to use

A list long enough that typing beats scanning: a category over hundreds of rows, a client, a product. A short list: `Select`. Several values from a short list: `CheckboxGroup`.

## API reference

<ApiTable component="Combobox" />

## Keyboard

| Key | Does |
| --- | --- |
| Typing | Filters the list (the caller filters; the list opens) |
| `ArrowUp`, `ArrowDown` | Move through the items |
| `Enter` | Picks the highlighted item |
| `Esc` | Closes the list |
