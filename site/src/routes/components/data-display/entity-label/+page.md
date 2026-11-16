---
title: EntityLabel
description: A named thing with its mark and one line about it, as one unit.
section: Data display
order: 7
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

`icon` draws the mark in a chip; `media` takes something drawn already, an `Avatar`. The name truncates on one line.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'entity-label', label: 'Label', part: 'EntityLabel', placement: 'top' },
  { slot: 'icon-chip', label: 'Mark', placement: 'left' },
  { selector: '[data-slot="entity-label"] div > :first-child', label: 'Title', placement: 'right' },
]} />

## Examples

### States and badges

<Preview example={examples.states} />

### In a table

<Preview example={examples['in-a-table']} />

## When to use

A record named in a table cell, a list, a header: an item, a supplier, a person. A whole row with its own actions: `Item`.

## API reference

<ApiTable component="EntityLabel" />
