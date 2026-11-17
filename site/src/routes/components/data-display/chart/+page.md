---
title: Chart
description: The frame a LayerChart chart draws in, with mise's colours and quiet axes.
section: Data display
order: 20
group: Measures
keywords: [graph, line chart, area chart, layerchart]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

mise draws charts with [LayerChart](https://layerchart.com); `ChartContainer` is the frame. Its `config` names each series and its colour, and the container writes the colours as `--color-<key>` for both schemes, scoped to the chart, so a series says `color: 'var(--color-completed)'`. It restyles LayerChart to quiet axes and grid lines. `chartGrid`, `chartAreaFillOpacity`, `chartLineStrokeWidth` and `chartComparisonSeriesClass` carry the rest of the look, and `ChartTooltip` goes in the chart's `tooltip` snippet.

The site imports `layerchart`, `d3-scale` and `d3-shape` itself, as an app does: mise depends on them, but a strict package manager lets an app import only what it lists.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'chart', label: 'Container', part: 'ChartContainer', placement: 'top' },
  { selector: '[data-slot="chart"] .lc-axis.placement-left', label: 'Axis', placement: 'left' },
  { selector: '[data-slot="chart"] path.lc-path', label: 'Series', placement: 'right' },
  { selector: '[data-slot="chart"] .lc-legend-container', label: 'Legend', placement: 'bottom' },
]} />

## Examples

### With a comparison

<Preview example={examples.comparison} />

### With markers

<Preview example={examples.markers} />

### The series palette

<Preview example={examples.palette} />

## When to use

A series someone will read closely: a week of orders, a month of sales. A trend beside a figure, with no axes: `Sparkline`. Shares of a whole: `SegmentedBar`.

## API reference

<ApiTable component="ChartContainer" />
