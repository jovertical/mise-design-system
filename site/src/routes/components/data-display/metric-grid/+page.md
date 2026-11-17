---
title: MetricGrid
description: A breakdown as a grid of bordered cells, each a MetricBar.
section: Data display
order: 14
group: Measures
keywords: [breakdown, distribution]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

A reader comparing sub-groups against each other wants them adjacent, not in order. Each cell is a `MetricBar`; a caller wanting other content in the cells wants `CardGrid` directly. `columns` applies from `md` up, with one column below, and the caller picks it knowing how many items there are.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'card-grid', label: 'Grid', part: 'MetricGrid', placement: 'top' },
  { slot: 'card-grid-cell', label: 'Cell', placement: 'left' },
  { selector: '[data-slot="card-grid-cell"]:nth-child(2) [data-slot="metric-bar"]', label: 'Bar', placement: 'right' },
]} />

## Examples

### Two columns, one toned cell

<Preview example={examples['two-columns']} />

## When to use

Sub-groups with no order between them: stock by category, capacity by dock. When the order means something, a ranking or a sequence: `MetricRow` in a `CardList`.

## API reference

<ApiTable component="MetricGrid" />
