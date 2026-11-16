---
title: IconChip
description: An icon in a tinted square or circle, beside a label or heading a row.
section: Data display
order: 5
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

The icon is the app's own (Tabler), passed as the child; the chip sizes it.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'icon-chip', label: 'Chip', part: 'IconChip', placement: 'left' },
  { selector: '[data-slot="icon-chip"] svg', label: 'Icon', placement: 'top' },
]} />

## Examples

### Tones, sizes and shapes

<Preview example={examples['tones-and-sizes']} />

## When to use

A glyph that marks what a fact or a row is about: a detail list, a stat tile, a metric. A person: `Avatar`. Not beside a radio or a checkbox, where a row of glyphs reads as a second control.

## API reference

<ApiTable component="IconChip" />
