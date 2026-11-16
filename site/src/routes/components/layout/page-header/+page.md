---
title: PageHeader
description: A page's title, what it is for, where it sits and its actions; the page's only h1.
section: Layout
order: 2
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Three shapes cover most pages: a listing (title, description, one action), a record (a trail to its parent, the record as the title, its status and actions) and a create or edit form (a back link instead of a trail). A long title wraps rather than pushing the actions off the edge.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'breadcrumb', label: 'Trail', placement: 'left' },
  { selector: '[data-slot="page-header"] h1', label: 'Title', placement: 'left' },
  { slot: 'badge', label: 'Title accessory', placement: 'top' },
  { selector: '[data-slot="page-header"] > p', label: 'Eyebrow', placement: 'left' },
  { selector: '[data-slot="page-header"] div:has(> h1) + div', label: 'Description', placement: 'left' },
  { selector: '[data-slot="page-header"] div:has(> [data-slot="button"])', label: 'Actions', placement: 'right' },
]} />

`breadcrumb`, `backLink`, `titleAccessory` and `actions` are snippets; `eyebrow` and `description` take a string or a snippet.

## Examples

### A record

<Preview example={examples.detail} />

### A form, with a back link

<Preview example={examples['back-link']} />

### A truncated title

<Preview example={examples.truncated} />

## When to use

At the top of every page, inside `PageLayout`. With no `title` the trail is the title and there is no `h1`, so the body must supply one. A section inside the page: `Heading`.

## API reference

<ApiTable component="PageHeader" />
