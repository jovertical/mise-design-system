---
title: Badge
description: A status, a tag or a count, as a small label on something else.
section: Data display
order: 3
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Three treatments over the six tones: `soft` for a status, `outline` for a tag, `solid` for a status that has to interrupt. The neutral badge is regular weight and the toned ones medium: a neutral badge labels a row, weight is for a state.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'badge', label: 'Badge', part: 'Badge', placement: 'left' },
]} />

## Examples

### Tags and the loud one

<Preview example={examples.treatments} />

### Counts

<Preview example={examples.count} />

### From a domain status

<Preview example={examples['from-a-status']} />

## When to use

A record's state in a list or a header, a unit or category, an unread count. A change up or down: `DeltaBadge`.

## API reference

<ApiTable component="Badge" />
