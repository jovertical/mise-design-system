---
title: LockedOverlay
description: A card the reader cannot open yet, with a blurred sample and the way in over it.
section: Feedback
order: 12
group: Gates
keywords: [locked, permission, paywall]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

It goes inside a card's content: the card's frame and header stay, and its children become a blurred sample under the `title`, `message` and `action`. The sample is illustrative, not the reader's data.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'locked-overlay', label: 'Overlay', part: 'LockedOverlay', placement: 'left' },
  { slot: 'locked-overlay-sample', label: 'Blurred sample', placement: 'right' },
  { slot: 'button', label: 'Action', placement: 'bottom' },
]} />

## Examples

### Over metric bars

<Preview example={examples['over-metric-bars']} />

## When to use

One card on a page the reader's role or setup cannot open. A whole page for a feature not turned on: `FeaturePreview`.

## API reference

<ApiTable component="LockedOverlay" />
