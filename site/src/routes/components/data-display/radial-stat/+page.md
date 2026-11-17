---
title: RadialStat
description: A share, drawn as an arc with the figure inside it.
section: Data display
order: 17
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

A circle has an obvious whole, so the ring says "roughly a quarter" without the reader converting a length. The stroke is a fraction of the `diameter`: `regular` a twelfth, a ring around a figure; `thick` a sixth, with the weight to carry a card on its own.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'radial-stat', label: 'Ring', part: 'RadialStat', placement: 'left' },
  { selector: '[data-slot="radial-stat"] circle:last-of-type', label: 'Arc', placement: 'top' },
  { selector: '[data-slot="radial-stat"] > div', label: 'Figure', placement: 'right' },
]} />

## Examples

### Diameters and tones

<Preview example={examples.tones} />

### In a list

<Preview example={examples['in-a-list']} />

### A count inside

<Preview example={examples.count} />

## When to use

A handful of parts side by side, each a share of its own whole. A list of shares: `MetricBar`, since twenty rings are a wall of dials. Parts of one whole in a single bar: `SegmentedBar`.

## API reference

<ApiTable component="RadialStat" />
