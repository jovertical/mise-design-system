---
title: Sheet
description: A panel from the edge of the screen, for a quick view or a short task beside the page.
section: Overlays
order: 3
traits: [keyboard, overlay]
keywords: [side panel, drawer, slide over]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

The page stays in view behind it, so a sheet suits looking at one record from a list without leaving the list.

## Anatomy

<Anatomy example={examples.anatomy} size="lg" parts={[
  { slot: 'sheet-overlay', label: 'Backdrop', placement: 'left' },
  { slot: 'sheet-content', label: 'Panel', part: 'SheetContent', placement: 'bottom' },
  { slot: 'sheet-title', label: 'Title', part: 'SheetTitle', placement: 'left' },
  { slot: 'sheet-description', label: 'Description', part: 'SheetDescription', placement: 'left' },
  { selector: '[data-slot="sheet-content"] button:has(.sr-only)', label: 'Close button', placement: 'top' },
  { slot: 'sheet-footer', label: 'Footer', part: 'SheetFooter', placement: 'left' },
]} />

## Examples

### Every side

<Preview example={examples.sides} />

## When to use

A quick view of a record, or filters, beside the page. A task the page waits on: `Dialog`. A bottom sheet on a phone: `Drawer`.

## API reference

<ApiTable component="Sheet" />

## Keyboard

| Key | Does |
| --- | --- |
| `Esc` | Closes the sheet |
| `Tab` | Moves through the panel, never out of it |
