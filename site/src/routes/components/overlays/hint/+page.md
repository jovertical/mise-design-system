---
title: Hint
description: The ? that explains the thing it sits beside, to whoever asks.
section: Overlays
order: 8
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

A button, not a bare icon, so a keyboard opens it too. It carries what a caption cannot fit and says it only to whoever asks. Use it sparingly: one per figure is plenty.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'tooltip-trigger', label: 'The ?', part: 'Hint', placement: 'bottom' },
  { slot: 'tooltip-content', label: 'Explanation', placement: 'right' },
]} />

`open` is bindable, so a screen can open a hint from an action of its own, and `contentProps` reaches the tooltip's panel.

## Examples

### In a card title

<Preview example={examples['in-a-card-title']} />

### When not to

<Preview example={examples['when-not-to']} />

## When to use

An explanation longer than a caption that only some readers need: how a figure is counted, what a status means. A short label for an icon button: `Tooltip`. Something everyone needs to read: say it on the page.

## API reference

<ApiTable component="Hint" />

## Keyboard

| Key | Does |
| --- | --- |
| `Tab` | Focuses the `?`, which opens the explanation |
| `Esc` | Closes it |
