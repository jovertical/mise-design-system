---
title: Spinner
description: Something is in progress, said to a screen reader as well as drawn.
section: Feedback
order: 7
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

`role="status"` and an `aria-label`, unlike a hand-spun icon, which is silent to a screen reader. With children, the caption is what it announces.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'spinner', label: 'Spinner', part: 'Spinner', placement: 'left' },
]} />

## Examples

### Sizes

<Preview example={examples.sizes} />

## When to use

Inside a control that is busy, or beside a line of text. A button that is saving takes `loading` instead. A panel waiting on content: `Skeleton` where the shape is known, `LoadingState` where it is not.

## API reference

<ApiTable component="Spinner" />
