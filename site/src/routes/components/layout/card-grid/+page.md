---
title: CardGrid
description: Cells of totals in a grid inside a card, ruled apart.
section: Layout
order: 5
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

`columns` is 2, 3 or 4; the cells rule themselves apart. What goes in a cell is yours.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'card-grid', label: 'Grid', part: 'CardGrid', placement: 'top' },
  { slot: 'card-grid-cell', label: 'Cell', part: 'CardGridCell', placement: 'left' },
]} />

## Examples

### Categorised totals

<Preview example={examples.categorised} />

## When to use

Independent totals side by side. Parts of one whole, each with its share: `MetricGrid`. One headline figure per tile on a dashboard: `StatTile` in a `CardGrid` of tiles. Rows rather than cells: `CardList`.

## API reference

<ApiTable component="CardGrid" />
