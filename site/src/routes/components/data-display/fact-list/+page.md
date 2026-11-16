---
title: FactList
description: Label and value pairs, in a row each or stacked.
section: Data display
order: 9
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

A card of facts is a `Card` with a `FactList` in it. `compact` tightens the gap, for a list that is a footnote to something above it.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'fact-list', label: 'List', part: 'FactList', placement: 'top' },
  { slot: 'fact-list-item', label: 'Fact', part: 'FactListItem', placement: 'left' },
  { selector: '[data-slot="fact-list-item"] dd', label: 'Value', placement: 'right' },
]} />

## Examples

### Stacked, with icons

<Preview example={examples.vertical} />

### Two blocks, with a total

<Preview example={examples['two-blocks']} />

## When to use

The details of one record: on its page, in a summary, in a side column. Rows of many records: `Table`. Figures with bars: `MetricRow`.

## API reference

<ApiTable component="FactList" />
