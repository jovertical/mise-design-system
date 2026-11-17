---
title: Tooltip
description: A short label on hover or focus, for a control that cannot carry its own.
section: Overlays
order: 7
traits: [overlay]
keywords: [hint, title]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Keep it to a phrase: a tooltip leaves when the pointer does, so anything a reader has to work through is gone before they finish. It brings its own provider, so nothing wraps the app for it.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'tooltip-trigger', label: 'Trigger', part: 'TooltipTrigger', placement: 'bottom' },
  { slot: 'tooltip-content', label: 'Tooltip', part: 'TooltipContent', placement: 'right' },
]} />

## Examples

### Every side

<Preview example={examples.sides} />

## When to use

A label for an icon button, a truncated cell, or a disabled action that owes a reason. A paragraph explaining a figure: `Hint`. A preview of a record: `HoverCard`.

## API reference

<ApiTable component="Tooltip" />
