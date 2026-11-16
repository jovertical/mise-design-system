---
title: Theming
description: Restyle mise through its tokens, from a one-line override to a generated theme.
section: Getting started
order: 2
---

A component never carries a colour of its own: it reads the semantic tokens (`--primary`, `--muted-foreground`, `--success`) and the tone maps built on them. So the way to change how mise looks is to change the tokens, never a component's classes. Recolouring `--success` recolours every success badge, alert, bar and toast together.

There are three levels. Use the lowest one that does the job.

## 1. The default

The imports in [Installation](/getting-started/installation) are all it takes: a zinc base, an indigo brand, system fonts, and a light and a dark scheme. These docs wear it.

## 2. Override tokens in CSS

For a brand colour, a radius or a font, override the tokens after the import:

```css
@import '@jovertical/mise-design-system/theme.css';

:root {
  --primary: oklch(0.6 0.15 160);
  --radius: 0.5rem;
  --font-sans: 'Inter', system-ui, sans-serif;
}

.dark {
  --primary: oklch(0.75 0.13 160);
}
```

The tokens are a contract, listed in `SEMANTIC_TOKENS` from `@jovertical/mise-design-system/tokens` and drawn on the [Colour](/foundations/colour) page. The `-soft` tints are mixed from their ink, so they follow an override on their own. `--accent` is the active navigation row only, not a second brand colour.

## 3. A theme from a config

For a different base grey, a whole brand ramp, or another hue for a status, write a config:

```js
// mise.theme.js
import { defineTheme } from '@jovertical/mise-design-system/tokens'

export default defineTheme({
  base: 'stone', // zinc | slate | gray | neutral | stone
  primary: 'teal', // a Tailwind hue name, or a ramp with all of 50 to 950
  status: { warning: 'orange' }, // info | success | warning | critical
  charts: ['teal', 'sky', 'amber', 'rose', 'violet'],
  radius: '0.5rem',
  buttonRadius: '0.5rem', // fully round by default
  fonts: { sans: "'Inter', system-ui, sans-serif" },
})
```

and generate a stylesheet from it:

```sh
npx mise-theme mise.theme.js -o src/mise-theme.css
```

Import the generated file in place of `theme.css`, keeping the `@source` line, and re-run the command after changing the config. `presets` and `BASES` from `/tokens` list the ready-made combinations.

## Rules

- Theme through tokens; never restyle a component's colours, radius or type through `class`.
- Never write a palette class (`bg-teal-600`) or a `dark:` colour override. Both bypass the theme and break the other scheme.
- Status colour comes from `tone`. Change a status hue in the theme, not per component.
