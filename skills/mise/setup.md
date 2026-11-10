# Setting mise up

mise is a Svelte 5 library styled by Tailwind CSS v4. Setting it up is an install and four lines
of CSS. No app-wide provider is required: components are imported where they are used, a
`Tooltip` brings its own provider, and the `Sidebar` family has its own `SidebarProvider` as
part of the shell. `ThemeProvider` is optional (see Dark mode).

## Install

```sh
pnpm add @jovertical/mise-design-system
pnpm add -D tailwindcss tw-animate-css
```

With npm: `npm install @jovertical/mise-design-system` and
`npm install -D tailwindcss tw-animate-css`. `svelte`, `tailwindcss` and `tw-animate-css` are
peer dependencies; the app's own stylesheet imports all three, so they resolve from its install.

Tailwind v4 runs through its Vite plugin, `@tailwindcss/vite`, in the app's Vite config.

### What the app imports itself

mise's own dependencies are installed with it, but under pnpm an app can only
import packages it lists itself. Add these when the app's own code needs them:

| To | Add |
| --- | --- |
| Draw icons, including the one `EmptyState` asks for | `@tabler/icons-svelte-runes` |
| Build the values of `DatePicker`, `MonthPicker`, `Calendar` or `TimePicker` (`CalendarDate`, `Time`) | `@internationalized/date` |
| Draw charts with `ChartContainer` | `layerchart` and `d3-scale` |

Import icons one file each, `import IconTruck from '@tabler/icons-svelte-runes/icons/truck'`,
never from the package root, which re-exports every icon.

## The stylesheet

In the app's main stylesheet:

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@import '@jovertical/mise-design-system/theme.css';
@source '<relative path>/node_modules/@jovertical/mise-design-system/dist';
```

The `@source` line is required. Tailwind v4 skips `node_modules` when it looks for class names,
so without it every mise component renders unstyled. The path is relative to the stylesheet;
the sections below give it for each stack.

To use a generated theme ([theming.md](theming.md)), import that file instead of `theme.css`.

## SvelteKit

- The stylesheet is `src/app.css`, imported once from `src/routes/+layout.svelte`:
  `import '../app.css'`.
- The `@source` path is `'../node_modules/@jovertical/mise-design-system/dist'`.
- `Form` is available from `@jovertical/mise-design-system/form` once its optional peers are
  installed: `pnpm add formsnap sveltekit-superforms` (and a validator such as `zod`).

## Laravel with Inertia and Svelte

- The stylesheet is `resources/css/app.css`, which `laravel({ input: [...] })` in
  `vite.config.js` (or `.ts`) already lists as an entry, with `@tailwindcss/vite` among the
  plugins.
- The `@source` path is `'../../node_modules/@jovertical/mise-design-system/dist'`.
- Import components in the pages under `resources/js/Pages/` like any Svelte module.
- **`mise/form` is not available.** Its `sveltekit-superforms` dependency imports SvelteKit's
  `$app/*` modules, which a plain Vite build cannot resolve. Build forms with `Field` and the
  inputs, and keep the state in Inertia's `useForm`; Laravel's validation errors arrive in
  `form.errors` ([recipes/form.md](recipes/form.md)).

## Plain Svelte with Vite

- Import the stylesheet from the entry module (`src/main.ts`): `import './app.css'`.
- The `@source` path is relative to wherever that stylesheet lives, usually
  `'../node_modules/@jovertical/mise-design-system/dist'`.
- As with Inertia, use `Field` rather than `mise/form`.

## Dark mode

Dark mode is the `.dark` class on an ancestor, usually `<html>`. Either the app sets it itself,
or `ThemeProvider` does: it applies `light` or `dark` to `<html>`, follows the system setting by
default (`defaultTheme="system"`), and stores the choice under `storageKey`. Give each app its
own `storageKey`, so two apps on one host do not share a theme. `ThemeToggle` is the switch, and
`useTheme()` reads or sets the theme from code; both need the provider above them.

```svelte
<script lang="ts">
  import { ThemeProvider } from '@jovertical/mise-design-system'

  let { children } = $props()
</script>

<ThemeProvider storageKey="ops-theme">
  {@render children()}
</ThemeProvider>
```

## Toasts

Render `Toaster` once in the app's root layout, then call `toast('Order saved')` (also
`toast.success`, `toast.error` and the rest of `svelte-sonner`'s API) from anywhere.

## Check it

```sh
npx --no-install mise-theme info --json
```

It prints the installed version, the stack it detected, and `stylesheet`, the CSS file it found
importing mise. `"stylesheet": null` means the import above is missing or sits in a file it did
not search (`node_modules`, `vendor`, `public`, `storage`, `dist`, `build` and dot-folders are
skipped).
