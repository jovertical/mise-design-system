---
title: StatTile
description: "The dashboard's headline number: one figure, and the rest qualifies it."
section: Data display
order: 13
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

One tile states one figure, already formatted: mise has no opinion about currencies or locales. A unit, a delta, a description, a sparkline or a few rows qualify it. The icon sits in a chip so the eye lands on the number, and `tone` colours the figure only, for a figure with a direction; a tile that merely reports a total stays in ink.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { selector: '[data-stat-tile]', label: 'Tile', part: 'StatTile', placement: 'top' },
  { slot: 'icon-chip', label: 'Icon chip', placement: 'right' },
  { slot: 'delta-badge', label: 'Delta', placement: 'left' },
  { slot: 'sparkline', label: 'Visual', placement: 'top' },
  { slot: 'fact-list-item', label: 'Row', placement: 'bottom' },
]} />

## Examples

### Sizes

<Preview example={examples.sizes} />

### Loading and error

<Preview example={examples.states} />

### With a visual

<Preview example={examples.visual} />

### With rows, on a card or inset

<Preview example={examples.rows} />

### With an action or a footer

<Preview example={examples.footer} />

## When to use

A headline figure on a dashboard, four across or one or two at the top of a screen. A breakdown into parts: `MetricGrid` or `MetricRow`. A share of a whole on its own: `RadialStat`.

## API reference

<ApiTable component="StatTile" />
