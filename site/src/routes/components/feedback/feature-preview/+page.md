---
title: FeaturePreview
description: A whole page for a feature the reader cannot use yet, showing what it would give them.
section: Feedback
order: 11
group: Gates
keywords: [upsell, upgrade, paywall, coming soon]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

A title, a headline, a few `benefits`, a blurred `preview` of the feature in use, and the way in: `primaryAction`, and an optional `secondaryAction`.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'feature-preview', label: 'Page', part: 'FeaturePreview', placement: 'left' },
  { slot: 'feature-preview-sample', label: 'Blurred sample', placement: 'right' },
  { selector: '[data-slot="feature-preview"] ul', label: 'Benefits', placement: 'left' },
  { slot: 'button', label: 'The way in', placement: 'bottom' },
]} />

## When to use

A whole page for a feature not turned on for the reader's plan or location. One card the reader's role cannot open: `LockedOverlay`.

## API reference

<ApiTable component="FeaturePreview" />
