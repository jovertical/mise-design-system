---
title: EmptyState
description: What a list or a panel shows when it has nothing in it, with the way forward.
section: Feedback
order: 4
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

`icon`, `title`, `description` and `actions`, drawn by `Empty`'s parts. The `icon` is the app's own glyph, so add `@tabler/icons-svelte-runes`.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'empty-icon', label: 'Icon', placement: 'top' },
  { slot: 'empty-title', label: 'Title', placement: 'left' },
  { slot: 'empty-description', label: 'Description', placement: 'right' },
  { slot: 'empty-content', label: 'Actions', placement: 'bottom' },
]} />

## Examples

### Its fallback copy, and a title of its own

<Preview example={examples.defaults} />

## When to use

A list with no rows yet, a filter that matches nothing, a panel waiting on setup. A `DataTable` takes one as its `emptyState`. Something that went wrong: `ErrorState`.

## API reference

<ApiTable component="EmptyState" />
