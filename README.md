# mise-design-system

Svelte 5 components and a configurable Tailwind v4 theme for operations
dashboards: locations, shifts, orders, stock.

> Published to npm as `@jovertical/mise-design-system`; releases and the
> changelog are cut by release-please.
>
> **See it in an app:** [mise Logistics](https://jovertical.github.io/mise-design-system/),
> a demo operations app built only from mise ([source](examples/logistics)).

mise ports the API of a React design system to Svelte 5 and
[bits-ui](https://bits-ui.com). Its Svelte mechanics follow
[shadcn-svelte](https://shadcn-svelte.com). It ships a neutral default theme
(zinc with an indigo brand), which a consuming app configures on top.

## Install

```sh
pnpm add @jovertical/mise-design-system
pnpm add -D tailwindcss tw-animate-css
```

`svelte`, `tailwindcss` and `tw-animate-css` are peer dependencies. Your own
stylesheet imports all three, so they resolve from your install.

## Set up

In your app's main stylesheet:

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@import '@jovertical/mise-design-system/theme.css';
@source '../node_modules/@jovertical/mise-design-system/dist';
```

The `@source` line is required. Tailwind v4 skips `node_modules` when it
looks for classes, so without it every component renders unstyled. Adjust the
relative path to where your stylesheet lives.

Dark mode is the `.dark` class on an ancestor, usually `<html>`.

```svelte
<script lang="ts">
  import { Button } from '@jovertical/mise-design-system'
</script>

<Button>Open orders</Button>
<Button variant="outline" href="/shifts">Shifts</Button>
```

## Theming

Three levels, each optional.

**1. Use the default.** The imports above are all it takes.

**2. Override tokens in CSS.** The semantic tokens are a documented contract:
`--background`, `--foreground`, `--primary`, `--muted`, `--muted-foreground`,
`--border`, `--success`, `--warning`, `--destructive`, `--radius`,
`--font-sans`, `--font-heading`, `--font-mono`, and the rest listed in
`SEMANTIC_TOKENS`. Override any of them after the import:

```css
:root { --primary: oklch(0.6 0.15 160); --radius: 0.5rem; }
.dark { --primary: oklch(0.75 0.13 160); }
```

The `-soft` tints are `color-mix()` of their ink, so they follow automatically.

**3. Generate a theme from a config.** For a different base, brand ramp or
status mapping:

```js
// mise.theme.js
import { defineTheme } from '@jovertical/mise-design-system/tokens'

export default defineTheme({
  base: 'stone',              // zinc | slate | gray | neutral | stone
  primary: 'teal',            // a Tailwind hue name, or a custom 50–950 ramp
  status: { warning: 'orange' },
  radius: '0.5rem',
  fonts: { sans: "'Inter', system-ui, sans-serif" },
  light: { '--sidebar': 'oklch(0.98 0 0)' },
  dark: { '--sidebar': 'oklch(0.2 0 0)' },
})
```

```sh
npx mise-theme mise.theme.js -o src/mise-theme.css
```

Import `src/mise-theme.css` in place of `theme.css`. `emitThemeCss(config)`
is exported from `/tokens` too, if you would rather call it in your own build
script.

## AI agents

mise ships an agent skill, `skills/mise/`, that teaches a coding agent in your
app which mise component does which job, every component's props and
defaults, setup per stack, theming, and worked recipes. Install it with the
[`skills` CLI](https://github.com/vercel-labs/skills):

```sh
npx skills add jovertical/mise-design-system --skill mise
```

The same skill is in the package at
`node_modules/@jovertical/mise-design-system/skills/mise/`, matching the
installed version. `npx skills experimental_sync` links it from there, so it
updates with mise.

The skill reads the app's setup with `npx mise-theme info --json`: the
installed version, the stack, the theme config and the stylesheet that imports
mise.

## Develop

`pnpm dev:example` runs the logistics example against your working copy of
mise, rebuilding mise on save; see `examples/logistics/README.md`.

```sh
pnpm install
pnpm storybook        # http://localhost:6006
pnpm test             # svelte-check, lint, unit tests
pnpm build            # dist/ + dist/theme.css, then publint
```

## Licence

MIT. The components were ported from an earlier React design system by the
same author. Tailwind CSS's palette, shadcn/ui and shadcn-svelte are MIT too;
their notices are in `LICENSES/`.
