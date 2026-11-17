---
title: SegmentedCode
description: A code read off one screen and typed into another, split into groups.
section: Data display
order: 12
group: Records
keywords: [code, pairing code, reference]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

`groups` says how many characters each box holds, so the reader keeps their place. It shows a code; typing one in is an `InputOTP`.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'segmented-code', label: 'Code', part: 'SegmentedCode', placement: 'left' },
  { selector: '[data-slot="segmented-code"] > *', label: 'Group', placement: 'top' },
]} />

## Examples

### A pairing code

<Preview example={examples.pairing} />

## When to use

A licence key, a pairing code, a reference someone copies by hand. A code someone types in: `InputOTP`.

## API reference

<ApiTable component="SegmentedCode" />
