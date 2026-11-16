---
title: Progress
description: How far along something is, as a bar.
section: Feedback
order: 9
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

An unknown `value` draws an empty bar rather than an animated one: say what is happening in a line beside it instead.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'progress', label: 'Track', part: 'Progress', placement: 'left' },
  { slot: 'progress-indicator', label: 'Indicator', placement: 'top' },
]} />

## When to use

A job's progress: an import, a count, an upload. A measure against a capacity, with its label and figure: `MetricBar`. A page loading after a link: `NavigationProgress`.

## API reference

<ApiTable component="Progress" />
