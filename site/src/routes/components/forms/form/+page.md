---
title: Form
description: A SvelteKit form validated by superforms, with fields that wire their label, description and errors.
section: Forms
order: 25
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Import it from `@jovertical/mise-design-system/form`, and only in a SvelteKit app: superforms imports `$app/*`, which exists nowhere else. Install its peers first: `pnpm add formsnap sveltekit-superforms` and a validator such as `zod`. In an Inertia or plain Vite app, build forms from [Field](/components/forms/field) and the inputs, with the app's own form state.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'form', label: 'Form', part: 'Form', placement: 'top' },
  { slot: 'form-label', label: 'Label', part: 'FormLabel', placement: 'left' },
  { slot: 'input', label: 'Control', placement: 'right' },
  { slot: 'form-description', label: 'Description', part: 'FormDescription', placement: 'left' },
  { slot: 'form-field-errors', label: 'Errors', part: 'FormFieldErrors', placement: 'right' },
  { selector: '[data-slot="form"] button', label: 'Submit', part: 'FormButton', placement: 'bottom' },
]} />

## When to use

Any SvelteKit form with server validation. `FormField` wraps one field and `Control` (from formsnap) hands the control its `props`; `FormFieldset` and `FormLegend` group several, as `FieldSet` does.

## API reference

<ApiTable component="Form" />
