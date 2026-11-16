---
title: Installation
description: Install mise, wire its stylesheet into the app, and turn on dark mode.
section: Getting started
order: 1
---

mise is a Svelte 5 library styled by Tailwind CSS v4. Setting it up is an install and four lines of CSS. No app-wide provider is required: components are imported where they are used, a `Tooltip` brings its own provider, and the `Sidebar` family has its own `SidebarProvider`.

## Install

```sh
pnpm add @jovertical/mise-design-system
pnpm add -D tailwindcss tw-animate-css
```

`svelte`, `tailwindcss` and `tw-animate-css` are peer dependencies; the app's own stylesheet imports all three, so they resolve from its install. Tailwind v4 runs through its Vite plugin, `@tailwindcss/vite`.

### What the app imports itself

Under pnpm an app can only import packages it lists itself. Add these when the app's own code needs them:

| To | Add |
| --- | --- |
| Draw icons, including the one `EmptyState` asks for | `@tabler/icons-svelte-runes` |
| Build the values of `DatePicker`, `MonthPicker`, `Calendar` or `TimePicker` | `@internationalized/date` |
| Draw charts with `ChartContainer` | `layerchart` and `d3-scale` |

Import icons one file each, `@tabler/icons-svelte-runes/icons/truck`, never from the package root.

## The stylesheet

In the app's main stylesheet:

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@import '@jovertical/mise-design-system/theme.css';
@source '../node_modules/@jovertical/mise-design-system/dist';
```

The `@source` line is required. Tailwind v4 skips `node_modules` when it looks for class names, so without it every component renders unstyled. The path is relative to the stylesheet.

## Your stack

- **SvelteKit.** The stylesheet is `src/app.css`, imported once from `src/routes/+layout.svelte`. `Form` comes from `@jovertical/mise-design-system/form` once `formsnap` and `sveltekit-superforms` are installed.
- **Laravel with Inertia and Svelte.** The stylesheet is `resources/css/app.css`, and the `@source` path is `'../../node_modules/@jovertical/mise-design-system/dist'`. The `/form` entry needs SvelteKit, so build forms with `Field` and the inputs, with the state in Inertia's `useForm`.
- **Plain Svelte with Vite.** Import the stylesheet from the entry module; use `Field` rather than `/form`.

## Dark mode

Dark mode is the `.dark` class on an ancestor, usually `<html>`. Either the app sets it, or `ThemeProvider` does: it follows the system setting by default and stores the choice under `storageKey`. `ThemeToggle` is the switch. Give each app its own `storageKey`.

## Toasts

Render `Toaster` once in the root layout, then call `toast('Order saved')` from anywhere.

## Check it

```sh
npx --no-install mise-theme info --json
```

It prints the installed version, the stack it detected, and the stylesheet it found importing mise.
