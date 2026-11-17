---
title: Checklist
description: "The full \"Get started\" list: setup steps grouped into cards, each row folding open."
section: Data display
order: 22
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Each group is a card with its own share, and each row folds open to its description, its action and a way to the documentation. `expandedId` is controlled with no fallback inside, so it can follow a URL fragment without disagreeing with it, and only one row is open at a time. A group's `percent` is the server's answer, not counted from its tasks.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'checklist', label: 'Checklist', part: 'Checklist', placement: 'top' },
  { slot: 'card-title', label: 'Group', placement: 'left' },
  { slot: 'progress', label: 'Group share', placement: 'right' },
  { slot: 'checklist-task', label: 'Task', placement: 'left' },
]} />

## Examples

### Completed, skipped and not started

<Preview example={examples.states} />

### ChecklistCard

<Preview example={examples.card} />

<Anatomy example={examples['card-anatomy']} parts={[
  { slot: 'card', label: 'Card', part: 'ChecklistCard', placement: 'top' },
  { slot: 'radial-stat', label: 'Ring', placement: 'left' },
  { slot: 'checklist-card-item', label: 'Row', placement: 'right' },
  { slot: 'card-footer', label: 'Footer', placement: 'bottom' },
]} />

## When to use

`Checklist` for a setup page; `ChecklistCard` above a sidebar's nav, pointing at it. Both answer "what is worth doing next", where an untouched row is not a problem. "What does this page still need before I can save it" is `Readiness`, which tags rows Required.

## API reference

<ApiTable component="Checklist" />

## Keyboard

A row's title is a disclosure button: `Enter` or `Space` opens or closes it. Its actions are buttons and links of their own, beside it.
