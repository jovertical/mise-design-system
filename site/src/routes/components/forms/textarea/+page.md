---
title: Textarea
description: Several lines of text, with a counter when it has a limit.
section: Forms
order: 4
group: Text input
traits: [form control]
keywords: [multiline, notes, comment, character limit]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

With no `maxlength` there is no counter: a bare number counts up towards nothing.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'textarea', label: 'Textarea', part: 'Textarea', placement: 'left' },
  { selector: '[aria-live="polite"]', label: 'Counter', placement: 'right' },
]} />

## Examples

### With a limit

<Preview example={examples['with-limit']} />

## When to use

Free text longer than a line: notes, a reason, a description. One line is an `Input`.

## API reference

<ApiTable component="Textarea" />
