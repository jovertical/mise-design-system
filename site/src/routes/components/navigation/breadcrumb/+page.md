---
title: Breadcrumb
description: Where the page sits, as links to the pages above it.
section: Navigation
order: 2
keywords: [path, trail]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

The pages above are `BreadcrumbLink`s; the page itself is a `BreadcrumbPage`, plain text with `aria-current="page"`. In the logistics demo the header's trail is built from its navigation, so a page adds its record's name and nothing else.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'breadcrumb-list', label: 'Trail', part: 'BreadcrumbList', placement: 'top' },
  { slot: 'breadcrumb-link', label: 'Link', part: 'BreadcrumbLink', placement: 'left' },
  { slot: 'breadcrumb-separator', label: 'Separator', part: 'BreadcrumbSeparator', placement: 'bottom' },
  { slot: 'breadcrumb-page', label: 'Current page', part: 'BreadcrumbPage', placement: 'right' },
]} />

## Examples

### Long content

<Preview example={examples.long} />

### Collapsed

<Preview example={examples.collapsed} />

## When to use

In an app's header, on any page below the top of its section. The sections themselves are the `Sidebar`'s.

## API reference

<ApiTable component="Breadcrumb" />
