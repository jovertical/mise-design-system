---
title: SiteHeader
description: The bar above every page of a shell, floating over a blurred band.
section: Layout
order: 3
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

It sits inside `SidebarInset`, above `PageLayout`, its edges in line with the page column's, and sticks to the top as the page scrolls. Its children are the bar's contents: usually the sidebar's trigger, a `SiteHeaderSeparator`, where you are, then search and the account menu at the end. These docs' own header is one.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'site-header', label: 'Band', part: 'SiteHeader', placement: 'top' },
  { slot: 'site-header-bar', label: 'Bar', placement: 'bottom' },
  { slot: 'sidebar-trigger', label: 'Sidebar trigger', placement: 'left' },
  { slot: 'site-header-separator', label: 'Separator', part: 'SiteHeaderSeparator', placement: 'top' },
  { slot: 'command-trigger', label: 'Search', placement: 'right' },
]} />

## When to use

Once, in the app's shell. A page's own title and actions: `PageHeader`.

## API reference

<ApiTable component="SiteHeader" />
