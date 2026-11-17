---
title: SummaryCard
description: What one step of a flow produced, read-only, with a way back to change it.
section: Layout
order: 8
group: Cards
keywords: [summary, overview]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

An icon, a title and an optional `action` in the header, and the step's facts under it, usually a vertical `FactList`. Leave `action` out for a flow that only runs forward.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'card', label: 'Card', placement: 'left' },
  { slot: 'card-title', label: 'Icon and title', placement: 'top' },
  { slot: 'card-action', label: 'Action', placement: 'right' },
  { slot: 'fact-list', label: 'Facts', placement: 'left' },
]} />

## Examples

### In a row

<Preview example={examples['in-a-row']} />

## When to use

The review step of a create flow, or a builder's side column showing what each step set. A card of facts on a record's own page: a `Card` with a `FactList`.

## API reference

<ApiTable component="SummaryCard" />
