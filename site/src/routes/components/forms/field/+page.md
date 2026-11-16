---
title: Field
description: A label, its control, a description and an error, in the order every field is written.
section: Forms
order: 1
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Every control on these pages sits in a `Field`. The description goes under the control: it explains what to type, and a reader who already knows skips from the label to the box.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'field', label: 'Field', part: 'Field', placement: 'top' },
  { slot: 'field-label', label: 'Label', part: 'FieldLabel', placement: 'left' },
  { slot: 'input', label: 'Control' , placement: 'right' },
  { slot: 'field-description', label: 'Description', part: 'FieldDescription', placement: 'left' },
  { slot: 'field-error', label: 'Error', part: 'FieldError', placement: 'right' },
]} />

## Examples

### Beside a checkbox

`orientation="horizontal"` puts the control first and the label beside it; the description goes in `FieldContent`. `responsive` puts label and control on one line from `md` up, for the same question asked once per row.

<Preview example={examples.horizontal} />

### Required and invalid

<Preview example={examples.states} />

### A group with a legend

<Preview example={examples.fieldset} />

## When to use

Wrap every form control in a `Field`, one per question. In a SvelteKit form validated on the server, `Form` from `@jovertical/mise-design-system/form` wires the same parts to the form's errors.

## API reference

<ApiTable component="Field" />
