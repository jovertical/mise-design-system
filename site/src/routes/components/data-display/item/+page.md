---
title: Item
description: A list row with media, a title, a description and its own actions.
section: Data display
order: 8
group: Labels
keywords: [list item, row, media object]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

`sm` is what nearly every row wants; `md`'s padding is a card's, on something that is a row inside one, and `flush` drops the side padding for a container that supplies it. `ItemMedia variant="icon"` is an `IconChip`, with its `size`, `shape` and `tone`: a tone for a row in a state, not to tell rows apart.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'item', label: 'Row', part: 'Item', placement: 'top' },
  { slot: 'item-media', label: 'Media', part: 'ItemMedia', placement: 'left' },
  { slot: 'item-title', label: 'Title', part: 'ItemTitle', placement: 'top' },
  { slot: 'item-description', label: 'Description', part: 'ItemDescription', placement: 'bottom' },
  { slot: 'item-actions', label: 'Actions', part: 'ItemActions', placement: 'right' },
]} />

## Examples

### Clickable rows

<Preview example={examples.clickable} />

### In a card

<Preview example={examples['in-a-card']} />

## When to use

Rows of records that carry their own controls. A command in a menu: `DropdownMenuItem`, which closes the menu on a click. Rows ruled edge to edge in a card: `CardList`. Just a name and a line: `EntityLabel`.

## API reference

<ApiTable component="Item" />
