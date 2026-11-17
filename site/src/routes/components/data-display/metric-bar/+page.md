---
title: MetricBar
description: One measure, stated as a figure and drawn as a bar.
section: Data display
order: 15
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

The figure is the context: a reader who wants the value reads it rather than estimating it from the bar. `percent` is 0–100 and clamped, since anything over 100 is a bug upstream. Rows are read by scanning the bars; the figures are there for whoever wants the exact answer.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'metric-bar', label: 'Bar', part: 'MetricBar', placement: 'top' },
  { slot: 'metric-rank', label: 'Rank', part: 'MetricRank', placement: 'left' },
  { slot: 'progress', label: 'Fill', placement: 'bottom' },
]} />

## Examples

### With context

<Preview example={examples.context} />

### Ranked

<Preview example={examples.rank} />

### Tones

<Preview example={examples.tones} />

## When to use

A list of shares, one bar each: items by status, stock by location. Several figures about one subject: `MetricRow`. Parts compared side by side, in no order: `MetricGrid`. A handful of shares as rings: `RadialStat`.

## API reference

<ApiTable component="MetricBar" />
