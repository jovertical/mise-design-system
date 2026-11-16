---
title: SwitchField
description: A switch with its label and description on one surface, which can hold what it turns on.
section: Forms
order: 15
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Bind `checked`. Children are what the switch turns on: they show inside the same surface while it is on, and are unmounted while it is off, so nothing inside keeps fetching.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'switch-field', label: 'Field', part: 'SwitchField', placement: 'top' },
  { slot: 'switch', label: 'Switch', placement: 'right' },
]} />

`label` and `description` are props, drawn at the row's leading edge.

## Examples

### Several in a card

<Preview example={examples['in-a-card']} />

## When to use

A setting in a form that deserves a sentence of explanation, or that opens more fields. A bare toggle beside a label: `Switch`.

## API reference

<ApiTable component="SwitchField" />
