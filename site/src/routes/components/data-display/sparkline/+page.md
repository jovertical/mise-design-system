---
title: Sparkline
description: A figure's recent shape, drawn small enough to sit beside it.
section: Data display
order: 19
group: Measures
keywords: [trend, mini chart]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

No axes, no grid, no tooltip, no labels: it answers "is that number climbing or falling" in the space of a word. The data runs oldest first, and the width comes from whatever holds it. Give it an `aria-label`, since the shape says nothing to assistive tech without one. In a `StatTile` it goes in the `visual` slot.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'sparkline', label: 'Sparkline', part: 'Sparkline', placement: 'left' },
  { selector: '[data-slot="sparkline"] path[stroke]', label: 'Line', placement: 'top' },
  { selector: '[data-slot="sparkline"] path[fill^="url"]', label: 'Wash', placement: 'bottom' },
]} />

## Examples

### Direction, and too little data

<Preview example={examples.direction} />

### Tones

<Preview example={examples.tones} />

## When to use

Beside a figure, to show its trend. Anything that invites closer reading, with axes and a tooltip: `Chart`, on its own card.

## API reference

<ApiTable component="Sparkline" />
