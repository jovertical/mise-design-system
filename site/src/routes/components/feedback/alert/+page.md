---
title: Alert
description: A message in the page about the work on it, with what to do next.
section: Feedback
order: 2
group: Messages
keywords: [banner, callout, notice, message]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Most alerts are one sentence; a title is for a message that needs a heading and a paragraph, and it clamps to one line. With no icon the first column collapses, so a text-only alert sits flush left. On a phone the actions drop below the text.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'alert', label: 'Alert', part: 'Alert', placement: 'top' },
  { selector: '[data-slot="alert"] > svg', label: 'Icon', placement: 'top' },
  { slot: 'alert-title', label: 'Title', part: 'AlertTitle', placement: 'top' },
  { slot: 'alert-description', label: 'Description', part: 'AlertDescription', placement: 'bottom' },
  { slot: 'alert-action', label: 'Action', part: 'AlertAction', placement: 'right' },
]} />

## Examples

### Tones

<Preview example={examples.tones} />

### With a title and actions

<Preview example={examples['with-action']} />

## When to use

Something about the page the reader should know while working on it: a sync gap, a pending approval, a failure. Something that already happened and needs nothing back: a toast, from `Toaster`. A field's own error: `FieldError`.

## API reference

<ApiTable component="Alert" />
