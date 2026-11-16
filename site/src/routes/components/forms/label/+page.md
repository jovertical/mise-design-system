---
title: Label
description: The name of a control, joined to it by its id.
section: Forms
order: 2
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

`for` matches the control's `id`: clicking the label focuses the control, and a screen reader names the control by it.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'label', label: 'Label', part: 'Label', placement: 'left' },
  { slot: 'input', label: 'Its control', placement: 'right' },
]} />

## Examples

### Around a checkbox

<Preview example={examples['with-checkbox']} />

## When to use

Inside a [Field](/components/forms/field), use `FieldLabel`, which adds `required` and lines up with the field's description and error. Reach for `Label` on its own for a control that sits outside a field.

## API reference

<ApiTable component="Label" />
