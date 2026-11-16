---
title: LoadingState
description: A panel waiting on something whose shape is not known yet.
section: Feedback
order: 6
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

The mirror of `EmptyState`, on the same `Empty` parts, so a list that flips from one to the other does not move. Without a `title` it says a bare "Loading", the tell that a screen has not been given its own wording.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'spinner', label: 'Spinner', placement: 'top' },
  { slot: 'empty-title', label: 'Title', placement: 'left' },
  { slot: 'empty-description', label: 'Description', placement: 'right' },
]} />

## Examples

### With a way out

<Preview example={examples['with-actions']} />

### Choosing a treatment

<Preview example={examples.treatments} />

## When to use

Only where the shape of what is coming cannot be predicted. A known shape: `Skeleton`. A busy control: `Spinner`, or `loading` on a `Button`.

## API reference

<ApiTable component="LoadingState" />
