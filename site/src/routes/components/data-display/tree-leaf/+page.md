---
title: TreeLeaf
description: A row in a one-level nested list, drawn hanging from its parent.
section: Data display
order: 11
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Each leaf is an `<li>`: put them in a `<ul>` under their parent, and mark the last with `position="last"`.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'tree-leaf-stem', label: 'Stem and elbow', placement: 'left' },
  { slot: 'tree-leaf-media', label: 'Media', placement: 'top' },
  { slot: 'tree-leaf-label', label: 'Label', placement: 'top' },
  { slot: 'tree-leaf-trailing', label: 'Trailing', placement: 'right' },
]} />

## When to use

Things that belong to one parent, one level deep: a recipe's ingredients, a kit's parts, a bundle's items. Rows of records on their own: `Item` or `CardList`.

## API reference

<ApiTable component="TreeLeaf" />
