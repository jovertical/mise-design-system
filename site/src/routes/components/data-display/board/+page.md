---
title: Board
description: Columns of cards grouped by a status, a pipeline read across.
section: Data display
order: 21
group: Workflows
traits: [keyboard, draggable]
keywords: [kanban, pipeline, columns]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

`Board` holds `BoardColumn`s, each a fixed width, so a wide board scrolls sideways instead of squeezing every card to nothing. A column's dot carries its status's tone, and nothing else on the board does: the lanes and cards stay neutral, so six statuses still read as one surface. For an empty column pass no children; wrap an `{#each}` in `{#if items.length}`, since an `{#each}` that renders nothing still counts as children.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'board', label: 'Board', part: 'Board', placement: 'top' },
  { slot: 'board-column', label: 'Column', part: 'BoardColumn', placement: 'bottom' },
  { slot: 'board-column-dot', label: 'Dot', placement: 'top' },
  { slot: 'board-column-count', label: 'Count', placement: 'top' },
  { slot: 'board-card', label: 'Card', part: 'BoardCard', placement: 'left' },
  { slot: 'board-column-empty', label: 'Empty line', placement: 'right' },
]} />

## Examples

### Empty columns, and actions

<Preview example={examples.states} />

### Dragging cards

<Preview example={examples.dragging} />

mise never moves a card: `onMove` reports `{ id, from, to }`, and the card moves when the app's data does, usually after the server agrees. `accepts` on a column decides which cards it takes; by default, any card from another column.

## When to use

Records whose status is the point and whose count per status is small enough to see: orders through fulfilment, transfers through a warehouse. A Table and Board toggle in the page header gives the same records both ways. Many records, or records compared by their figures: `DataTable`.

## API reference

<ApiTable component="Board" />

## Keyboard

On a board with `onMove`:

| Key | Does |
| --- | --- |
| `Space` | Picks the focused card up; with a card held, drops it |
| `ArrowLeft` / `ArrowRight` | Moves the held card a column left or right |
| `Enter` | Drops the held card; with nothing held, follows the card's link |
| `Escape` | Puts the held card back |
