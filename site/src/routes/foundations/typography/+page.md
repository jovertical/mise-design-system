---
title: Typography
description: The heading and text sizes, and which component sets a page's type.
section: Foundations
order: 2
---

<script>
  import { TypeScale } from '#modules/docs/components/index.js'
</script>

Type comes from three components, so a page's face, weight and steps come from one place.

<TypeScale />

- **`PageHeader`** is a page's title, description and actions. It is the page's only `h1`.
- **`Heading`** is a section inside a page body. Choose `as` by where it sits in the outline and `size` by how big it should look: `lg` opens a page body, `md` matches a dialog's title, `sm` a card's.
- **`Text`** is body copy, with `size`, `muted`, `tone`, `weight` and `numeric` for figures in columns.

`CardTitle` and `DialogTitle` set their own type; a figure is a `StatTile` or a `MetricRow`, never a heading.

The fonts are `--font-sans`, `--font-heading` and `--font-mono`, set in the [theme](/getting-started/theming).
