---
title: AsideCard
description: A card of guidance in a side column, which folds away once read.
section: Layout
order: 7
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

A `Card` built on `Collapsible`: an icon and a title, with a toggle at the header's end; `open` starts it folded.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'card', label: 'Card', placement: 'left' },
  { slot: 'collapsible-trigger', label: 'Toggle', placement: 'top' },
  { slot: 'collapsible-content', label: 'Content', placement: 'right' },
]} />

## Examples

### Beside a form

<Preview example={examples['beside-a-form']} />

## When to use

Guidance a reader needs once: what a step does, what to check before going on. Facts about the record itself: `SummaryCard` or a `Card` with a `FactList`.

## API reference

<ApiTable component="AsideCard" />
