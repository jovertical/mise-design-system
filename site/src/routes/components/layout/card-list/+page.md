---
title: CardList
description: Rows inside one card, ruled edge to edge.
section: Layout
order: 6
group: Cards
keywords: [list, rows]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

The list supplies the padding and the rules, and nothing else: rows can be anything. `compact` for rows of one line.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'card-list', label: 'List', part: 'CardList', placement: 'left' },
  { slot: 'card-header', label: 'Divided header', placement: 'right' },
]} />

## Examples

### Item rows with actions

<Preview example={examples['item-rows']} />

### MetricBar rows

<Preview example={examples['metric-rows']} />

## When to use

A short list of records, measures or steps inside a card. A long list someone sorts and filters: `DataTable`.

## API reference

<ApiTable component="CardList" />
