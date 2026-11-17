---
title: Separator
description: A rule between blocks, or between items in a row.
section: Layout
order: 10
group: Structure
keywords: [divider, hr, rule]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'separator', label: 'Rule', part: 'Separator', placement: 'left' },
]} />

## Examples

### Vertical, in a toolbar

<Preview example={examples.vertical} />

## When to use

Between groups of questions in a form, or groups in a toolbar. A rule with a word on it ("or") between alternatives: `FieldSeparator`. A card's footer rule: `divided` on `CardFooter`.

## API reference

<ApiTable component="Separator" />
