---
title: Readiness
description: "What a page still needs before it can be saved: a summary and one row per requirement."
section: Data display
order: 23
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

`ReadinessChecklist` is one row per requirement; `ReadinessSummary` is the count, the bar and one line naming what is missing, since naming it beats reporting that something is. Neither brings its own surface: they go in an `AsideCard` on one page and a page body on another. `summariseReadiness(items)` asks the same question without a component.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'readiness-summary', label: 'Summary', part: 'ReadinessSummary', placement: 'top' },
  { slot: 'progress', label: 'Bar', placement: 'left' },
  { slot: 'readiness-checklist', label: 'Checklist', part: 'ReadinessChecklist', placement: 'left' },
  { selector: '[data-slot="readiness-checklist"] li[data-status="met"]', label: 'Met row', placement: 'right' },
  { slot: 'readiness-tag', label: 'Requirement tag', placement: 'right' },
]} />

## Examples

### Severities, and an action

<Preview example={examples.severities} />

### A progress list

<Preview example={examples.progress} />

### The summary, derived or overridden

<Preview example={examples.summary} />

## When to use

Beside a form whose save is gated, or on a record a server checks: a product before it goes on sale, a shift before it closes. `showDetail="all"` keeps what was found on the rows that passed, for a check already made. "What is worth doing next", where an untouched row is not a problem: `Checklist`.

## API reference

<ApiTable component="ReadinessChecklist" />
