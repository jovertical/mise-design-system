---
title: Empty
description: The parts of an empty panel, for composing one EmptyState does not draw.
section: Feedback
order: 3
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Most empty panels are an `EmptyState`, which composes these parts from props. Reach for `Empty` when a panel needs something those props do not take: a link in the description, media that is not an icon, a layout of its own.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'empty', label: 'Panel', part: 'Empty', placement: 'right' },
  { slot: 'empty-icon', label: 'Media', part: 'EmptyMedia', placement: 'top' },
  { slot: 'empty-title', label: 'Title', part: 'EmptyTitle', placement: 'left' },
  { slot: 'empty-description', label: 'Description', part: 'EmptyDescription', placement: 'right' },
  { slot: 'empty-content', label: 'Content', part: 'EmptyContent', placement: 'bottom' },
]} />

## When to use

A list or a panel with nothing in it yet, built by hand. The usual shape, from props: `EmptyState`. A load that failed: `ErrorState`.

## API reference

<ApiTable component="Empty" />
