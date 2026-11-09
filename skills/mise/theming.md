# Theming mise

A component never carries a colour of its own: it reads the semantic tokens (`--primary`,
`--muted-foreground`, `--success`) and the tone maps built on them. So the way to change how mise
looks is to change the tokens, never to override a component's classes. Recolouring `--success`
recolours every success badge, alert, bar and toast together.

There are three levels, each optional. Use the lowest one that does the job.

## 1. The default

The imports in [setup.md](setup.md) are all it takes: a zinc base, an indigo brand, system
fonts, and a light and a dark scheme.

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

The tokens are a documented contract, listed in `SEMANTIC_TOKENS` (exported from
`@jovertical/mise-design-system/tokens`): `--background`, `--foreground`, `--card`,
`--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--info`,
`--success`, `--warning`, each `-foreground` pair, `--border`, `--input`, `--ring`,
`--chart-1` to `--chart-5`, the `--sidebar-*` set and `--color-table-header`. Also `--radius`,
`--font-sans`, `--font-heading` and `--font-mono`.

The `-soft` tints (`bg-success-soft` and the like) are mixed from their ink, so they follow an
override on their own. `--accent` is the active navigation row only; it is not a second brand
colour.

## 3. A theme from a config

For a different base grey, a whole brand ramp, or a different hue for a status, write a config
and generate a stylesheet from it:

```js
// mise.theme.js
import { defineTheme } from '@jovertical/mise-design-system/tokens'

export default defineTheme({
  base: 'stone', // zinc | slate | gray | neutral | stone
  primary: 'teal', // a Tailwind hue name, or a custom ramp with all of 50 to 950
  status: { warning: 'orange' }, // info | success | warning | critical
  charts: ['teal', 'sky', 'amber', 'rose', 'violet'],
  radius: '0.5rem',
  fonts: { sans: "'Inter', system-ui, sans-serif" }, // sans | heading | mono
  light: { '--sidebar': 'oklch(0.98 0 0)' }, // single tokens, written last
  dark: { '--sidebar': 'oklch(0.2 0 0)' },
})
```

```sh
npx mise-theme mise.theme.js -o src/mise-theme.css
```

Import the generated file in place of `@jovertical/mise-design-system/theme.css` (keep the
`@source` line). Re-run the command after changing the config; in a build script,
`emitThemeCss(config)` from `/tokens` does the same in code. `presets` and `BASES` from
`/tokens` list the ready-made combinations.

`npx --no-install mise-theme info --json` reports the config it finds as `themeConfig`.

## Rules

- Theme through tokens; never restyle a component's colours, radius or type through `class`.
- Never write a palette class (`bg-teal-600`) or a `dark:` colour override in the app's UI. Both
  bypass the theme and break the other scheme.
- Status colour comes from `tone`, which reads `--info`, `--success`, `--warning` and
  `--destructive` (the `critical` tone). Change the status hue in the theme, not per component.
