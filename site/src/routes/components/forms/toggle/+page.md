---
title: Toggle
description: One button that stays pressed until pressed again.
section: Forms
order: 16
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Bind `pressed`. The pressed look follows `aria-pressed`, so a screen reader hears the same state a sighted reader sees.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'toggle', label: 'Toggle', part: 'Toggle', placement: 'left' },
]} />

## Examples

### Variants

<Preview example={examples.variants} />

### A grid of solid toggles

<Preview example={examples.solid} />

## When to use

One option that is on or off, drawn as a button: pin, bold, show archived. Two or more options: `ToggleGroup`. A setting in a form: `Switch` or `Checkbox`.

## API reference

<ApiTable component="Toggle" />

## Keyboard

| Key | Does |
| --- | --- |
| `Space`, `Enter` | Presses or releases it |
