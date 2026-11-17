---
title: Text
description: Body copy, with its size, weight, muting and tone.
section: Typography
order: 2
keywords: [paragraph, body, copy, muted]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

A `span` unless `as` says `p` or `div`. Without a `size` it inherits the line's, so a muted aside sits in a sentence at the sentence's size.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'text', label: 'Text', part: 'Text', placement: 'left' },
]} />

## Examples

### Weights

<Preview example={examples.weights} />

### Tones

<Preview example={examples.tones} />

### Line items and a total

<Preview example={examples['line-items']} />

### Truncated

<Preview example={examples.truncate} />

## API reference

<ApiTable component="Text" />
