---
title: ErrorState
description: An error page or panel, with what happened, why, and the way forward.
section: Feedback
order: 5
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

A refusal explains the rule, not the mechanism: the reader cannot fix permissions from here, so the useful action is the way out. These docs' own 404 page is one.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'error-state', label: 'Panel', part: 'ErrorState', placement: 'right' },
  { slot: 'empty-icon', label: 'Icon', placement: 'top' },
  { slot: 'empty-title', label: 'Title', placement: 'left' },
  { slot: 'empty-description', label: 'Description', placement: 'right' },
  { slot: 'empty-content', label: 'Back and home', placement: 'bottom' },
]} />

## Examples

### A thrown error

<Preview example={examples.thrown} />

### Annotated with its status

<Preview example={examples.annotated} />

## When to use

A page that cannot show what was asked for: not found, forbidden, failed to load. Nothing there yet: `EmptyState`. A problem the page can still work around: `Alert`.

## API reference

<ApiTable component="ErrorState" />
