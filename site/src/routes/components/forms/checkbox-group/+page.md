---
title: CheckboxGroup
description: Several ticks over one list, bound to an array of values.
section: Forms
order: 11
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Give it `options` and bind `value`, an array kept in the options' order. It is a fieldset with its own legend, description and error, so it stands in a form beside other fields without a `Field` around it.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'checkbox-group', label: 'Group', part: 'CheckboxGroup', placement: 'right' },
  { slot: 'field-legend', label: 'Legend', placement: 'left' },
  { slot: 'field-description', label: 'Description', placement: 'right' },
  { slot: 'checkbox', label: 'Option', placement: 'left' },
  { slot: 'field-error', label: 'Error', placement: 'right' },
]} />

## Examples

### With descriptions

<Preview example={examples.described} />

### Along a row

<Preview example={examples.horizontal} />

### Disabled, invalid, empty

<Preview example={examples.states} />

## When to use

Any of several values from a short list. One of several: `RadioGroup`, or `ChoiceRow`s when each choice needs room. A long list someone will search: `Combobox` with several values.

## API reference

<ApiTable component="CheckboxGroup" />
