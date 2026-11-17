---
title: SegmentedBar
description: A whole, divided into named parts, in one bar.
section: Data display
order: 18
group: Measures
keywords: [stacked bar, distribution, split]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

One bar rather than one per part, because the question is how the total splits. Each segment's `value` is in whatever unit the caller counts in; the shares come from the total. Segments are drawn in the order given, since sorting by size would make the same data look different week to week. The neutral segment takes the track's own colour, so "everything else" recedes behind the named slices.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'segmented-bar', label: 'Bar', part: 'SegmentedBar', placement: 'left' },
  { selector: '[data-slot="segmented-bar"] > div:first-child > div', label: 'Caption', placement: 'top' },
  { slot: 'segmented-bar-segment', label: 'Segment', placement: 'bottom' },
]} />

## Examples

### In a table row

<Preview example={examples['in-a-row']} />

### Narrow segments, and nothing counted

<Preview example={examples.narrow} />

## When to use

How one total divides: stock by status, a location's units by state. `showLabels` and `showShare` off for a bar heading a list that names the same parts. Shares of separate wholes: `MetricBar` or `RadialStat`.

## API reference

<ApiTable component="SegmentedBar" />
