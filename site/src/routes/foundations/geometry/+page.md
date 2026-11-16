---
title: Geometry
description: The radius scale, spacing, and the content column's cap.
section: Foundations
order: 3
---

<script>
  import { radiusScale } from '@jovertical/mise-design-system/tokens'
  import { RadiusScale } from '#modules/docs/components/index.js'
</script>

## Radius

Every step derives from the one `--radius`, so changing it in the [theme](/getting-started/theming) moves the whole scale in step.

<RadiusScale steps={Object.keys(radiusScale)} />

Cards and dialogs use `--radius-4xl`, clamped to 24px. Inputs, selects and toolbar pills are `rounded-2xl`. A button's corner is `--radius-button`, fully round by default.

## Spacing

`--spacing` is `0.25rem`, and every spacing utility is a multiple of it: `p-4` is 1rem.

## The content column

`max-w-content` caps the content, header bar included, at 96rem, so a table does not stretch across an ultrawide display. These docs use it.
