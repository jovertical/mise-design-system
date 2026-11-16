---
title: Timeline
description: A history of events, newest first, each with its status.
section: Data display
order: 10
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Each `TimelineItem` has a dot, a connector down to the next (left off the last), a title and its content.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'timeline-dot', label: 'Dot', part: 'TimelineDot', placement: 'left' },
  { slot: 'timeline-connector', label: 'Connector', part: 'TimelineConnector', placement: 'left' },
  { slot: 'timeline-title', label: 'Title', part: 'TimelineTitle', placement: 'top' },
  { slot: 'timeline-content', label: 'Content', part: 'TimelineContent', placement: 'right' },
]} />

## Examples

### Without icons, and loading

<Preview example={examples['without-icons']} />

### With presence

<Preview example={examples['with-presence']} />

## When to use

A record's history: an order's events, a conversation, a device's syncs. Steps a reader goes through: `Stepper`.

## API reference

<ApiTable component="Timeline" />
