---
title: Switch
description: On or off, taking effect at once.
section: Forms
order: 14
group: Choices
traits: [keyboard, form control]
keywords: [toggle, on off]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Bind `checked`. A switch acts the moment it is flipped; a choice saved with the rest of a form is a `Checkbox`.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'switch', label: 'Track', part: 'Switch', placement: 'left' },
  { slot: 'switch-thumb', label: 'Thumb', placement: 'top' },
  { slot: 'label', label: 'Label', placement: 'right' },
]} />

## Examples

### States

<Preview example={examples.states} />

## When to use

A setting that applies as soon as it is flipped: a filter, a view option. With a label and a description on its own surface in a form: `SwitchField`.

## API reference

<ApiTable component="Switch" />

## Keyboard

| Key | Does |
| --- | --- |
| `Space`, `Enter` | Flips it |
