---
title: QuantityInput
description: An amount and its unit, in one field.
section: Forms
order: 7
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

One control, not two: it binds `unit` and `quantity`, and takes one label. The units are a prop, so the app owns its list of measures.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'quantity-input', label: 'Quantity input', part: 'QuantityInput', placement: 'top' },
  { slot: 'select-value', label: 'Unit', placement: 'left' },
  { selector: '[data-slot="quantity-input"] input', label: 'Amount', placement: 'right' },
]} />

## Examples

### Quantity first, in a field

<Preview example={examples['quantity-first']} />

### Grouped units, with a menu footer

<Preview example={examples.grouped} />

## When to use

An amount whose unit the reader picks: a stock movement, a recipe line, a conversion. A number with a fixed unit is a `NumberInput` with a `prefix` or an `InputGroup`.

## API reference

<ApiTable component="QuantityInput" />
