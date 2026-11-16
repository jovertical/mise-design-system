---
title: Collapsible
description: A section that shows and hides, with no look of its own.
section: Layout
order: 9
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

It holds `open` and nothing else: the trigger and the content are what you put in them. `AsideCard` builds a card on it.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'collapsible', label: 'Collapsible', part: 'Collapsible', placement: 'left' },
  { slot: 'collapsible-trigger', label: 'Trigger', part: 'CollapsibleTrigger', placement: 'top' },
  { slot: 'collapsible-content', label: 'Content', part: 'CollapsibleContent', placement: 'right' },
]} />

## When to use

Detail that most readers skip, on a surface that is not a card. On a card in a side column: `AsideCard`. Sections that replace each other: `Tabs`.

## API reference

<ApiTable component="Collapsible" />

## Keyboard

| Key | Does |
| --- | --- |
| `Enter`, `Space` | Opens or closes it from its trigger |
