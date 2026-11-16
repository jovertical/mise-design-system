---
title: PageLayout
description: The page's padded column, holding its header and its sections.
section: Layout
order: 1
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Every page is `PageLayout` with a `PageHeader` first and its sections after. The layout owns the padding and the gaps, so the sections bring none of their own.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'page-layout', label: 'Page column', part: 'PageLayout', placement: 'left' },
  { slot: 'page-header', label: 'Header', placement: 'right' },
  { slot: 'card', label: 'A section', placement: 'right' },
]} />

## When to use

Once per page, inside `SidebarInset` under the `SiteHeader`. A dashboard is `PageLayout`, `PageHeader`, then a `CardGrid` of `StatTile`s.

## API reference

<ApiTable component="PageLayout" />
