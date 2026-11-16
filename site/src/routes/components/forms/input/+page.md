---
title: Input
description: One line of text.
section: Forms
order: 3
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Bind `value`; give it an `id` its label points at. A number, a price or a count is a `NumberInput`, never `Input type="number"`.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'input', label: 'Input', part: 'Input', placement: 'left' },
]} />

## Examples

### Sizes

<Preview example={examples.sizes} />

### Invalid, disabled, read only

<Preview example={examples.states} />

## When to use

One line of free text. Several lines: `Textarea`. An icon, a unit or a button inside the box: `InputGroup`. A number: `NumberInput`.

## API reference

<ApiTable component="Input" />
