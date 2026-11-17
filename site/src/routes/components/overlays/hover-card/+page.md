---
title: HoverCard
description: A preview that opens on hover or focus, behind a link.
section: Overlays
order: 6
traits: [overlay]
keywords: [preview, hover]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

The trigger is a link that goes somewhere on a click; the card is a glance at what it leads to, for a reader with a pointer or the keyboard. Nothing in it should be the only way to reach something.

## Anatomy

<Anatomy example={examples.anatomy} size="lg" parts={[
  { slot: 'hover-card-trigger', label: 'Trigger', part: 'HoverCardTrigger', placement: 'left' },
  { slot: 'hover-card-content', label: 'Card', part: 'HoverCardContent', placement: 'right' },
]} />

## When to use

A person's or a record's summary behind its name. A single short label: `Tooltip`. Anything someone must act on: `Popover`, which opens on a click.

## API reference

<ApiTable component="HoverCard" />
