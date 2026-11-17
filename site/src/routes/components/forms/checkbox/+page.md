---
title: Checkbox
description: One tick, on or off, with indeterminate for "some of these".
section: Forms
order: 10
group: Choices
traits: [keyboard, form control]
keywords: [tick, check]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Bind `checked`. A checkbox with a description beside it goes in a horizontal `Field`, as on the [Field](/components/forms/field) page.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'checkbox', label: 'Box', part: 'Checkbox', placement: 'left' },
  { slot: 'checkbox-indicator', label: 'Tick', placement: 'top' },
  { slot: 'label', label: 'Label', placement: 'right' },
]} />

## Examples

### States

<Preview example={examples.states} />

## When to use

A setting that is on or off and takes effect when the form is saved. Several ticks over one list of values: `CheckboxGroup`. A setting that takes effect at once: `Switch`.

## API reference

<ApiTable component="Checkbox" />

## Keyboard

| Key | Does |
| --- | --- |
| `Space` | Ticks or clears it |
