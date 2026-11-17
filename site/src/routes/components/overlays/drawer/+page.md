---
title: Drawer
description: A sheet that slides up from the bottom of a phone screen, and can be dragged away.
section: Overlays
order: 4
traits: [overlay, draggable]
keywords: [bottom sheet, mobile]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Built on vaul: a bottom drawer has a handle and closes when dragged down. For a phone-width screen that wants a bottom sheet rather than a centred `Dialog`.

## Anatomy

<Anatomy example={examples.anatomy} size="lg" parts={[
  { slot: 'drawer-content', label: 'Drawer', part: 'DrawerContent', placement: 'top' },
  { slot: 'drawer-title', label: 'Title', part: 'DrawerTitle', placement: 'left' },
  { slot: 'drawer-description', label: 'Description', part: 'DrawerDescription', placement: 'left' },
  { slot: 'drawer-footer', label: 'Footer', part: 'DrawerFooter', placement: 'right' },
]} />

## Examples

### Every direction

<Preview example={examples.directions} />

## When to use

A short task on a phone: a filter, a quick action. On a desktop, a side panel is a `Sheet` and a task in a window is a `Dialog`.

## API reference

<ApiTable component="Drawer" />
