---
title: ButtonGroup
description: Buttons, and the input or text they belong with, joined into one control.
section: Forms
order: 18
group: Choices
keywords: [split button, segmented]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Neighbours overlap by a pixel, and a toned button sits above them, so a critical outline stays whole on the side it shares.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'button-group', label: 'Group', part: 'ButtonGroup', placement: 'top' },
  { slot: 'button-group-text', label: 'Text', part: 'ButtonGroupText', placement: 'left' },
  { slot: 'button-group-separator', label: 'Separator', part: 'ButtonGroupSeparator', placement: 'bottom' },
  { slot: 'input', label: 'Input', placement: 'right' },
]} />

## Examples

### Stacked

<Preview example={examples.vertical} />

### Around an input

<Preview example={examples['with-input']} />

## When to use

A few actions on one thing, read as one control. Options that stay pressed: `ToggleGroup`. A number with steppers: `NumberInput` with `controls`, which does this for you.

## API reference

<ApiTable component="ButtonGroup" />
