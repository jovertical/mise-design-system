---
title: ThemeToggle
description: The switch between light and dark.
section: Actions
order: 4
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

Pressing it here switches these docs, as the one in the header does. It needs a `ThemeProvider` above it: the provider sets `light` or `dark` on `<html>`, follows the system by default, and stores the choice under its `storageKey`.

```svelte
<script>
  import { ThemeProvider, ThemeToggle } from '@jovertical/mise-design-system'
</script>

<ThemeProvider storageKey="ops-theme">
  <ThemeToggle />
</ThemeProvider>
```

`useTheme()` reads or sets the theme from code, under the same provider.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { selector: 'button[aria-label^="Switch to"]', label: 'Toggle', part: 'ThemeToggle', placement: 'left' },
]} />

## When to use

Once, in the app's header. Give each app its own `storageKey`, so two apps on one host do not share a theme.

## API reference

<ApiTable component="ThemeToggle" />
