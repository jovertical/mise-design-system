---
title: RadioGroup
description: One choice from a few, all shown at once.
section: Forms
order: 12
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Bind `value` on the group; each `RadioGroupItem` has a `value` and an `id` its label points at.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'radio-group', label: 'Group', part: 'RadioGroup', placement: 'right' },
  { slot: 'radio-group-item', label: 'Item', part: 'RadioGroupItem', placement: 'left' },
  { slot: 'radio-group-indicator', label: 'Selected mark', placement: 'bottom' },
  { slot: 'label', label: 'Label', placement: 'right' },
]} />

## Examples

### With descriptions

<Preview example={examples.described} />

## When to use

One of two to five choices, worth seeing side by side. Each choice needing room, media or more fields: `ChoiceRow`. Many choices: `Select`.

## API reference

<ApiTable component="RadioGroup" />

## Keyboard

| Key | Does |
| --- | --- |
| `Tab` | Moves into the group, onto the chosen item |
| Arrow keys | Move to the next or previous item and choose it |
