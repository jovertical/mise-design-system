---
title: Popover
description: A floating panel beside its trigger, for a few fields or a short list.
section: Overlays
order: 5
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

A popover is a positioned panel and nothing more: its padding and width are the component's, the content is yours. That is the difference from `DropdownMenu`, which is a menu of commands and says so to a screen reader. `matchTriggerWidth` sizes the panel to its trigger and drops the padding, for a select-like list.

## Anatomy

<Anatomy example={examples.anatomy} size="lg" parts={[
  { slot: 'popover-trigger', label: 'Trigger', part: 'PopoverTrigger', placement: 'left' },
  { slot: 'popover-content', label: 'Panel', part: 'PopoverContent', placement: 'right' },
]} />

## Examples

### A list that scrolls

<Preview example={examples['scrolling-list']} />

## When to use

A few fields or a short list that belong to one control: a filter, notifications. Commands: `DropdownMenu`. A preview on hover: `HoverCard`. A label on hover: `Tooltip`.

## API reference

<ApiTable component="Popover" />

## Keyboard

| Key | Does |
| --- | --- |
| `Enter`, `Space` | Opens it from its trigger |
| `Esc` | Closes it and returns focus to the trigger |
