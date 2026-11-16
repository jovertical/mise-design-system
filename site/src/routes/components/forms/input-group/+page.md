---
title: InputGroup
description: An input with an icon, a unit or a button inside its box.
section: Forms
order: 5
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

An adornment is a sibling of the input, not an icon positioned over an `Input`: the text never runs under the glyph, and the focus ring goes around the whole group.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'input-group', label: 'Group', part: 'InputGroup', placement: 'top' },
  { slot: 'input-group-addon', label: 'Addon', part: 'InputGroupAddon', placement: 'left' },
  { slot: 'input-group-control', label: 'Input', part: 'InputGroupInput', placement: 'bottom' },
  { slot: 'input-group-button', label: 'Button', part: 'InputGroupButton', placement: 'right' },
]} />

## Examples

### A unit on each side

<Preview example={examples['with-text']} />

## When to use

Search fields, prices with a currency, an amount with its unit, a field with a copy or clear button. `InputGroupTextarea` does the same around several lines.

## API reference

<ApiTable component="InputGroup" />
