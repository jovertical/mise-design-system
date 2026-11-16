---
title: DeltaBadge
description: A change up or down, coloured by whether it is good.
section: Data display
order: 4
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Give it the change as a number; it adds the sign, the arrow and the unit (`%` by default).

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'delta-badge', label: 'Delta', part: 'DeltaBadge', placement: 'left' },
  { selector: '[data-slot="delta-badge"] svg', label: 'Arrow', placement: 'top' },
]} />

## Examples

### Inverted

<Preview example={examples.inverted} />

### Units and money

<Preview example={examples.units} />

### Plain, in a sentence

<Preview example={examples.plain} />

## When to use

A change against a previous period, beside a figure: a `StatTile` takes one as its `delta`. A state rather than a change: `Badge`.

## API reference

<ApiTable component="DeltaBadge" />
