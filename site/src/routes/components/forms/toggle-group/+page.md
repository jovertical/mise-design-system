---
title: ToggleGroup
description: A row of options, one or several pressed, as a segmented track or joined buttons.
section: Forms
order: 17
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

`type="single"` binds one value; `type="multiple"` binds an array.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'toggle-group', label: 'Track', part: 'ToggleGroup', placement: 'left' },
  { slot: 'toggle-group-item', label: 'Item', part: 'ToggleGroupItem', placement: 'top' },
]} />

## Examples

### Several pressed

<Preview example={examples.multiple} />

### Variants

<Preview example={examples.variants} />

### Sizes

<Preview example={examples.sizes} />

## When to use

A preset picker, a time range, a view switch, a filter by kind. Sections of a page with content under each: `Tabs`. Actions rather than options: `ButtonGroup`.

## API reference

<ApiTable component="ToggleGroup" />

## Keyboard

| Key | Does |
| --- | --- |
| `Tab` | Moves into the group |
| `ArrowLeft`, `ArrowRight` | Move between items |
| `Space`, `Enter` | Presses the focused item |
