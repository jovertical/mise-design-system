---
title: Heading
description: A section heading inside a page body.
section: Typography
order: 1
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

A page's own title is `PageHeader`'s, and a card's or a dialog's has its own part (`CardTitle`, `DialogTitle`). `Heading` is for a section inside a page body. Choose `as` by where it sits in the outline, never by how big it should look: that is `size`.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'heading', label: 'Heading', part: 'Heading', placement: 'left' },
]} />

## Examples

### Sizes

<Preview example={examples.sizes} />

## API reference

<ApiTable component="Heading" />
