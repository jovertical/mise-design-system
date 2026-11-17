---
title: NumberInput
description: A number, a price or a count, typed into a text field and committed as a number.
section: Forms
order: 6
group: Text input
traits: [keyboard, form control]
keywords: [money, currency, amount, price, stepper]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Use it for every number, never `Input type="number"`: it formats as you type, clamps to `min` and `max` on blur, and binds a `number`, or `null` for an empty field. A price is integer cents: bind `1999` and the field shows `19.99`.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'number-input', label: 'Number input', part: 'NumberInput', placement: 'top' },
  { selector: 'button[aria-label^="Decrease"]', label: 'Decrease', placement: 'left' },
  { selector: '[data-slot="number-input"] input', label: 'Field', placement: 'bottom' },
  { selector: 'button[aria-label^="Increase"]', label: 'Increase', placement: 'right' },
]} />

## Examples

### Formats

<Preview example={examples.formats} />

### Controls and steps

<Preview example={examples.controls} />

### Clearing, and signed numbers

<Preview example={examples.clearable} />

## When to use

Any number someone types: a count, a price, a weight, a lead time. An amount with a unit picked beside it is a `QuantityInput`.

## API reference

<ApiTable component="NumberInput" />

## Keyboard

| Key | Does |
| --- | --- |
| `ArrowUp`, `ArrowDown` | Steps the value by `step` |
| `Shift` + arrow | Steps by ten steps |
