---
title: mise
description: Svelte 5 components and a Tailwind v4 theme for operations dashboards.
---

<script>
  import { resolve } from '$app/paths'
</script>

mise is a library of Svelte 5 components, built on [bits-ui](https://bits-ui.com), and a configurable Tailwind v4 theme. It is made for operations dashboards: locations, shifts, orders, stock. A component never carries a colour of its own, so one theme restyles all of it.

```sh
pnpm add @jovertical/mise-design-system
```

## Where to start

- [Installation](/getting-started/installation): the install, four lines of CSS, and how it fits SvelteKit, Inertia or plain Vite.
- [Theming](/getting-started/theming): the default, token overrides, and a theme generated from a config.

## See it in an app

<a href="{resolve('/')}demo/">mise Logistics</a> is a demo operations app built only from mise: orders as a table and a board, shipments, fleet, stock and settings. Its source is in the repository's `examples/logistics`.
