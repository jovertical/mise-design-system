---
title: MetricRow
description: A subject, the figures that describe it, and one bar beneath them all.
section: Data display
order: 16
group: Measures
keywords: [breakdown, capacity]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Rows go in a `CardList`, which rules them off. Each stat sits under its own caption and takes a tone of its own; tone is spent on a few figures, since a row where every number is coloured reads as an alert. `hideBar` is for a row with nothing to measure, where an empty bar would read as a failure.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'metric-row', label: 'Row', part: 'MetricRow', placement: 'top' },
  { slot: 'icon-chip', label: 'Icon chip', placement: 'left' },
  { selector: '[data-slot="metric-row"] > div > div:last-child', label: 'Stats', placement: 'right' },
  { slot: 'progress', label: 'Bar', placement: 'bottom' },
]} />

## Examples

### Inline bar

<Preview example={examples.inline} />

## When to use

A thing with several measurements: a location's availability, low stock and stock-outs. When the bar is the point and one figure states it: `MetricBar`.

## API reference

<ApiTable component="MetricRow" />
