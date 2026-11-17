---
title: Stepper
description: Where a reader is in a flow of steps, and the Back and Next that move it.
section: Navigation
order: 4
keywords: [wizard, steps, multi-step]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

`steps` are `{ id, name, description, icon? }`; `currentStepId` names where the reader is. Without `completedSteps`, every step before the current one counts as done. `StepperNavigation` is the row under a step body.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'stepper', label: 'Stepper', part: 'Stepper', placement: 'left' },
  { selector: '[aria-current="step"]', label: 'Current step', placement: 'top' },
  { slot: 'stepper-navigation', label: 'Navigation', part: 'StepperNavigation', placement: 'bottom' },
]} />

## Examples

### Variants

<Preview example={examples.variants} />

### Selectable steps, and a skipped one

<Preview example={examples.selectable} />

### The navigation row

<Preview example={examples.navigation} />

## When to use

A setup or a create flow of several steps taken in order. Sections a reader moves between freely: `Tabs`.

## API reference

<ApiTable component="Stepper" />
