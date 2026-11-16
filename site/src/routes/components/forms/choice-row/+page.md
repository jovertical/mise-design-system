---
title: ChoiceRow
description: A radio or a checkbox on a bordered row, with room for a description, media and what the choice reveals.
section: Forms
order: 13
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

The row is a label for the control in `control`: a click anywhere on it reaches the control, and the row follows the control's state. `for` must match the control's `id`.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'choice-row', label: 'Row', part: 'ChoiceRow', placement: 'top' },
  { slot: 'checkbox', label: 'Control', placement: 'left' },
  { slot: 'badge', label: 'Badge', placement: 'right' },
]} />

`label`, `description` and `badge` are props; `control` and `media` are snippets.

## Examples

### Several at once

<Preview example={examples['with-checkbox']} />

### With media

<Preview example={examples['with-media']} />

### Revealing what the choice needs

<Preview example={examples.revealed} />

## When to use

A choice whose options need a description, a picture or fields of their own. Short options seen side by side: `RadioGroup` or `CheckboxGroup`. A setting turned on or off: `SwitchField`.

## API reference

<ApiTable component="ChoiceRow" />
