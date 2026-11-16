---
title: Card
description: A surface holding one section of a page, with its header, content and footer.
section: Layout
order: 4
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Compose before customising: a card of facts is a `Card` with a `FactList` in it, not a styled `div`. `variant="ghost"` keeps the card's layout and drops its surface, for a section that sits on the page.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'card', label: 'Card', part: 'Card', placement: 'top' },
  { slot: 'card-title', label: 'Title', part: 'CardTitle', placement: 'left' },
  { slot: 'card-description', label: 'Description', part: 'CardDescription', placement: 'left' },
  { slot: 'card-action', label: 'Action', part: 'CardAction', placement: 'right' },
  { slot: 'card-content', label: 'Content', part: 'CardContent', placement: 'left' },
  { slot: 'card-footer', label: 'Footer', part: 'CardFooter', placement: 'right' },
]} />

## Examples

### With an action

<Preview example={examples['with-action']} />

### Footers

<Preview example={examples.footers} />

### Icons and hints in the title

<Preview example={examples.titles} />

### A footer to the edges

<Preview example={examples['bleed-footer']} />

## When to use

A titled section on a page. Cards in a grid: `CardGrid`. Rows inside one card: `CardList`. A collapsible card in a side column: `AsideCard`.

## API reference

<ApiTable component="Card" />
