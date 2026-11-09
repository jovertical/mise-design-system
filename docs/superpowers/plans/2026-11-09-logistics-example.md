# The logistics example Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. In this repo the user has chosen inline execution in the main session.

**Goal:** A logistics operations app in `examples/logistics/`, built only from mise, on seeded mock data a visitor can change, deployed to GitHub Pages from `main`.

**Architecture:** A SvelteKit single-page app (`ssr = false`, adapter-static with a `404.html` fallback, `paths.base` for Pages) in the repository's pnpm workspace, depending on mise through `workspace:*`, so it uses mise's built `dist/` exactly as an app does. Data is a fixed seed behind one runes store persisted to `localStorage`; pages read and write only through repository functions. Anything mise lacks is added to mise first.

**Tech Stack:** SvelteKit 3, `@sveltejs/adapter-static` 4, Svelte 5, Tailwind v4, mise (workspace), superforms + zod, LayerChart, TanStack Table 9, Vitest 5, Biome 2.6, GitHub Actions + Pages.

**Spec:** `docs/specs/2026-11-09-logistics-example-design.md`. Wireframes were reviewed in the browser on 2026-11-09 (`.superpowers/brainstorm/`, git-ignored).

## Global Constraints

- The example's package is `mise-logistics-example`, `"private": true`, in `examples/logistics/`.
- It depends on `"@jovertical/mise-design-system": "workspace:*"` and imports only the package's public entries (`@jovertical/mise-design-system`, `/form`, `/tokens`, `/theme.css` is replaced by the generated theme). Never `src/lib/...` of mise.
- No UI component is built in the example that mise should have. `examples/logistics/src/lib/components/` holds only app-specific compositions of mise parts. A gap stops the screen until mise has it (spec E6).
- Copy: the company is "mise Logistics (demo)"; locations Riverside DC, Harbour Hub, North Yard, Market Street; people and clients invented and generic; money in `$`, stored as integer cents; no real businesses.
- Dates come from offsets to `DEMO_TODAY = '2026-07-14'`; never `new Date()` for data.
- Commits in `examples/` are `chore(example)` or `docs(example)`; mise's own changes keep their component scopes.
- Dependencies are installed by the user. A task that needs one stops and asks with the exact command.
- Commit only when the gate passes: the root `pnpm test` and `pnpm build:storybook` for a change in mise, plus `pnpm --filter mise-logistics-example test` for a change in the example (after the root `pnpm build`). Phases of at most 5 tasks; phase-gates report and an explicit go before the next phase; push only after approval.
- Screenshot every new screen in light and dark (the smoke script, Task 4) before each phase report.
- **Spec refinement:** the root `pnpm test` does not run the example's checks, because CI runs `pnpm test` before `pnpm build` and the example needs mise's `dist/`. CI runs them as a separate step after `pnpm build` (Task 4).

## File map

| File | Responsibility |
| --- | --- |
| `pnpm-workspace.yaml` | gains `packages: ['examples/*']` |
| `package.json` (root) | gains `dev:example` |
| `.github/workflows/ci.yml` | gains the example's checks after `pnpm build` |
| `.github/workflows/example.yml` | builds and deploys the example to Pages |
| `examples/logistics/package.json`, `vite.config.ts`, `tsconfig.json`, `biome.json` | the app's tooling |
| `examples/logistics/mise.theme.js`, `src/mise-theme.css` | the brand and its generated stylesheet |
| `examples/logistics/src/app.css`, `src/app.html` | the stylesheet and the document |
| `examples/logistics/src/routes/+layout.ts`, `+layout.svelte` | `ssr = false`; the shell |
| `examples/logistics/src/routes/**/+page.svelte` | the screens |
| `examples/logistics/src/lib/data/seed/*.ts` | the fixed dataset |
| `examples/logistics/src/lib/data/types.ts` | entity types |
| `examples/logistics/src/lib/data/store.svelte.ts` | the persisted store |
| `examples/logistics/src/lib/data/<entity>.ts` | repositories and derived figures |
| `examples/logistics/src/lib/data/schemas.ts` | zod schemas |
| `examples/logistics/src/lib/format.ts` | money, dates, weights for display |
| `examples/logistics/src/lib/components/*.svelte` | app-specific compositions |
| `examples/logistics/tests/*.test.ts` | Vitest |
| `examples/logistics/scripts/smoke.ts` | the route smoke test and screenshots |

---

## Phase 1: the workspace, the shell, and a live deploy

### Task 1: The workspace and an empty app

**Files:**
- Modify: `pnpm-workspace.yaml`, root `package.json`
- Create: `examples/logistics/package.json`, `vite.config.ts`, `tsconfig.json`, `biome.json`, `src/app.html`, `src/app.css`, `src/routes/+layout.ts`, `src/routes/+layout.svelte`, `src/routes/+page.svelte`, `.gitignore`

- [ ] **Step 1: Add the workspace**

`pnpm-workspace.yaml`, at the top:

```yaml
packages:
  - 'examples/*'
```

Root `package.json` `scripts`, after `build:skill`:

```json
"dev:example": "pnpm build && concurrently -k -n mise,example \"svelte-package --watch\" \"pnpm --filter mise-logistics-example dev\"",
```

`concurrently` is a new root dev dependency; ask the user (`pnpm add -D -w concurrently`). If they decline, the script is two terminals, documented in the example's README instead.

- [ ] **Step 2: The package**

`examples/logistics/package.json`:

```json
{
  "name": "mise-logistics-example",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev --port 5180",
    "build": "vite build",
    "preview": "vite preview --port 5181",
    "theme": "mise-theme mise.theme.js -o src/mise-theme.css",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --fail-on-warnings",
    "lint": "biome check .",
    "test:unit": "vitest run",
    "test": "pnpm check && pnpm lint && pnpm test:unit",
    "smoke": "pnpm build && tsx scripts/smoke.ts"
  },
  "dependencies": {
    "@jovertical/mise-design-system": "workspace:*"
  }
}
```

Stop and ask the user to install, from `examples/logistics/`:

```sh
pnpm add -D @sveltejs/kit @sveltejs/adapter-static @sveltejs/vite-plugin-svelte vite svelte \
  tailwindcss @tailwindcss/vite tw-animate-css typescript svelte-check vitest jsdom tsx @biomejs/biome
pnpm add formsnap sveltekit-superforms zod layerchart d3-scale d3-shape @tanstack/svelte-table @lucide/svelte
```

- [ ] **Step 3: Tooling**

`examples/logistics/vite.config.ts`:

```ts
import adapter from '@sveltejs/adapter-static'
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

/**
 * A single-page app: every route renders in the browser, and adapter-static
 * writes a 404.html that GitHub Pages serves for any deep link, which then
 * boots the router. BASE_PATH is the repository's Pages path in CI.
 */
export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      adapter: adapter({ fallback: '404.html' }),
      paths: { base: (process.env.BASE_PATH ?? '') as '' | `/${string}` },
    }),
  ],
  test: { environment: 'jsdom', include: ['tests/**/*.test.ts'] },
})
```

`examples/logistics/tsconfig.json`:

```json
{
  "extends": "$app/tsconfig",
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "types": ["$app/types", "node", "vitest/globals"]
  },
  "include": ["src", "tests", "scripts", "vite.config.ts"]
}
```

`examples/logistics/biome.json`: `{ "extends": ["../../biome.json"], "files": { "includes": ["src/**", "tests/**", "scripts/**", "*.ts", "!src/mise-theme.css"] } }`. If Biome 2.6 rejects a relative `extends` with root-level `files`, copy the root config's formatter and linter blocks instead.

`examples/logistics/.gitignore`: `.svelte-kit/`, `build/`, `.smoke/`.

- [ ] **Step 4: The document, the stylesheet, an empty page**

`src/app.html`: SvelteKit's standard template with `<html lang="en">` and `%sveltekit.head%` / `%sveltekit.body%`.

`src/app.css` (Task 2 replaces the theme import):

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@import '@jovertical/mise-design-system/theme.css';
@source '../node_modules/@jovertical/mise-design-system/dist';
```

`src/routes/+layout.ts`: `export const ssr = false` and `export const prerender = false`.

`src/routes/+layout.svelte`: imports `../app.css` and renders `{@render children()}`.

`src/routes/+page.svelte`: a mise `Button` reading "mise Logistics (demo)".

- [ ] **Step 5: Build and look**

```bash
pnpm build && pnpm --filter mise-logistics-example build && ls examples/logistics/build
pnpm --filter mise-logistics-example check
```

Expected: `build/index.html` and `build/404.html` exist; check passes. Serve `build/` and screenshot `/` (Task 4's script does this; for now `python3 -m http.server` in `build/` and the headless shell): the button is styled, which proves the `@source` path.

- [ ] **Step 6: Commit**

`chore(example): scaffold the logistics example in the workspace`.

### Task 2: The theme

**Files:**
- Create: `examples/logistics/mise.theme.js`, `src/mise-theme.css` (generated), `tests/theme.test.ts`
- Modify: `src/app.css`

- [ ] **Step 1: The failing test**

`tests/theme.test.ts` runs the real binary, as `pnpm theme` does, into `.smoke/` and compares:

```ts
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

const root = join(import.meta.dirname, '..')
const bin = join(root, 'node_modules/@jovertical/mise-design-system/bin/mise-theme.js')

describe('the theme', () => {
  it('is current; run pnpm theme if not', () => {
    mkdirSync(join(root, '.smoke'), { recursive: true })
    execFileSync('node', [bin, 'mise.theme.js', '-o', '.smoke/theme.css'], { cwd: root })
    const generated = readFileSync(join(root, '.smoke/theme.css'), 'utf8')
    const committed = readFileSync(join(root, 'src/mise-theme.css'), 'utf8')
    expect(committed).toContain('--color-primary-600')
    expect(committed).toBe(generated)
  })
})
```

Run it: FAIL, `src/mise-theme.css` does not exist.

- [ ] **Step 2: The config and the stylesheet**

`mise.theme.js`:

```js
import { defineTheme } from '@jovertical/mise-design-system/tokens'

/** The demo's brand: teal on stone, with a softer radius than mise's default. */
export default defineTheme({
  base: 'stone',
  primary: 'teal',
  status: { warning: 'amber' },
  charts: ['teal', 'sky', 'amber', 'rose', 'violet'],
  radius: '0.5rem',
})
```

Run `pnpm --filter mise-logistics-example theme`. In `app.css`, replace the `theme.css` import with `@import './mise-theme.css';`.

- [ ] **Step 3: Test, look, commit**

`pnpm --filter mise-logistics-example test:unit` passes; the button is teal. Commit `chore(example): the logistics theme, generated with mise-theme`.

### Task 3: The shell

**Files:**
- Modify: `src/routes/+layout.svelte`
- Create: `src/lib/navigation.ts`, `src/lib/components/app-sidebar.svelte`, `src/lib/components/app-header.svelte`, placeholder `+page.svelte` for `/orders`, `/shipments`, `/fleet`, `/products`, `/warehouses`, `/clients`, `/settings/general`

- [ ] **Step 1: The navigation model**

`src/lib/navigation.ts`:

```ts
import type { Component } from 'svelte'
import Boxes from '@lucide/svelte/icons/boxes'
import Building2 from '@lucide/svelte/icons/building-2'
import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard'
import Package from '@lucide/svelte/icons/package'
import Settings from '@lucide/svelte/icons/settings'
import ShoppingCart from '@lucide/svelte/icons/shopping-cart'
import Truck from '@lucide/svelte/icons/truck'
import Users from '@lucide/svelte/icons/users'

export type NavItem = { label: string; href: string; icon: Component }
export type NavGroup = { label: string; items: NavItem[] }

export const NAVIGATION: NavGroup[] = [
  { label: 'Overview', items: [{ label: 'Operations overview', href: '/', icon: LayoutDashboard }] },
  {
    label: 'Orders',
    items: [
      { label: 'Orders', href: '/orders', icon: ShoppingCart },
      { label: 'Shipments', href: '/shipments', icon: Package },
    ],
  },
  { label: 'Fleet', items: [{ label: 'Fleet', href: '/fleet', icon: Truck }] },
  {
    label: 'Inventory',
    items: [
      { label: 'Products', href: '/products', icon: Boxes },
      { label: 'Warehouses', href: '/warehouses', icon: Building2 },
    ],
  },
  { label: 'Partners', items: [{ label: 'Clients', href: '/clients', icon: Users }] },
  { label: 'Settings', items: [{ label: 'General', href: '/settings/general', icon: Settings }] },
]
```

Check each icon name against `node_modules/@lucide/svelte/dist/icons/` (canonical names; the handoff warns about aliases).

- [ ] **Step 2: Sidebar and header**

Read `skills/mise/components/navigation.md` (`Sidebar` and its parts), `feedback.md` (`NavigationProgress`, `Toaster`), `actions.md` (`ThemeToggle`, `ThemeProvider`, `DropdownMenu`) and the Sidebar stories in `src/lib/components/navigation/sidebar/sidebar.stories.svelte` for the provider/inset arrangement. Build:

- `app-sidebar.svelte`: `Sidebar` with a header (logo square in `bg-primary`, "mise Logistics", a `Badge` "demo"), one `SidebarGroup` per `NAVIGATION` group, menu buttons as links with `resolve(href)` from `$app/paths` and the active state from `page.url.pathname` (`$app/state`), and a footer user menu (`DropdownMenu`: "Ops manager", items "Reset demo data" — wired in Task 9 — and "About this demo" linking to the repository).
- `app-header.svelte`: the sidebar trigger, a `Breadcrumb` from the current group and item, a search button opening ⌘K (wired in Phase 6; until then it is absent), and `ThemeToggle`.
- `+layout.svelte`: `ThemeProvider storageKey="mise-logistics-demo-theme"` around `SidebarProvider`, `AppSidebar`, the inset holding `AppHeader` and `<main>{@render children()}</main>`, then `Toaster` and `NavigationProgress` (driven by `navigating` from `$app/state`).

Placeholders: each route renders `PageLayout` > `PageHeader` with its title and an `EmptyState` "Coming in the next phase".

- [ ] **Step 3: Check and look**

`pnpm --filter mise-logistics-example check` passes. Build, serve, screenshot `/` and `/orders` in light and dark: the sidebar highlights the current item, the breadcrumb follows, dark mode switches. Commit `chore(example): the app shell`.

### Task 4: Checks in CI, and the smoke script

**Files:**
- Modify: `.github/workflows/ci.yml`
- Create: `examples/logistics/scripts/smoke.ts`, `examples/logistics/scripts/routes.ts`

- [ ] **Step 1: CI**

In `ci.yml`, after the "Package and publint" step:

```yaml
      - name: Example checks
        run: pnpm --filter mise-logistics-example test
      - name: Example builds
        run: pnpm --filter mise-logistics-example build
```

- [ ] **Step 2: The route list**

`scripts/routes.ts` exports `ROUTES: string[]`: every screen path, plus `'/orders/OR-2041'` and `'/orders/does-not-exist'` once those routes exist (append them in Tasks 11 and 13).

- [ ] **Step 3: The smoke script**

`scripts/smoke.ts`, run by `pnpm smoke` after a build:

1. Serve `build/` on port 5199 with `node:http`, answering an unknown path with `404.html` (as Pages does).
2. For each route and each scheme (`light`, `dark`): run the headless shell (`CHROME` env var, defaulting to the Playwright headless-shell path in the handoff) with `--dump-dom` and `--screenshot=.smoke/<route>-<scheme>.png --window-size=1440,1000 --virtual-time-budget=8000`. The scheme is set by appending `?scheme=dark`, which `+layout.svelte` reads once on load to call the theme state's setter (a demo-only hook; document it in the layout).
3. Fail the run if the dumped DOM has no `<main>` with content, or contains SvelteKit's error page markup, unless the route is `/orders/does-not-exist`, which must contain the `ErrorState` text.
4. Print one line per route and scheme, and a summary.

Console errors cannot be read through `--dump-dom`; if the user later installs puppeteer, extend the script to fail on `console.error` and `pageerror`. Note this limit in the script's header.

- [ ] **Step 4: Run and commit**

`pnpm build && pnpm --filter mise-logistics-example smoke` passes for every route. Commit `chore(example): CI checks and a local smoke run`.

### Task 5: Deploy to GitHub Pages

**Files:**
- Create: `.github/workflows/example.yml`

- [ ] **Step 1: Ask the user to enable Pages**

Repository Settings › Pages › Build and deployment › Source: **GitHub Actions**. Wait for confirmation.

- [ ] **Step 2: The workflow**

```yaml
name: Example

on:
  push:
    branches: [main]
    paths: ['src/**', 'skills/**', 'examples/**', 'package.json', 'pnpm-lock.yaml', '.github/workflows/example.yml']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v6
      - uses: actions/setup-node@v5
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm --filter mise-logistics-example build
        env:
          BASE_PATH: /mise-design-system
      - uses: actions/upload-pages-artifact@v3
        with:
          path: examples/logistics/build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Commit, then the phase gate**

Commit `chore(example): deploy the logistics example to GitHub Pages`. Stop for the Phase 1 report: screenshots of `/` and `/orders` in both schemes, the test counts, and the request to push. After the push, watch both workflows; open `https://jovertical.github.io/mise-design-system/` and a deep link (`/mise-design-system/orders`) with the headless shell and confirm both render.

---

## Phase 2: the data layer

### Task 6: Types, format helpers and the seed

**Files:**
- Create: `src/lib/data/types.ts`, `src/lib/data/seed/{locations,vehicles,drivers,clients,products,orders,shipments,index}.ts`, `src/lib/format.ts`
- Test: `tests/seed.test.ts`

- [ ] **Step 1: The types**

```ts
export type Id = string
export type Cents = number
/** Days relative to DEMO_TODAY, plus a clock time: { day: -2, time: '09:30' }. */
export type DemoTime = { day: number; time: string }

export type Location = {
  id: Id
  name: string
  city: string
  manager: string
  capacityUnits: number
  docks: number
  zones: { name: string; used: number; capacity: number }[]
}

export type VehicleStatus = 'on-route' | 'loading' | 'idle' | 'workshop'
export type Vehicle = {
  id: Id
  code: string
  registration: string
  type: 'van' | 'truck'
  homeLocationId: Id
  driverId: Id | null
  status: VehicleStatus
  mileageKm: number
  nextServiceDay: number
  condition: 'excellent' | 'good' | 'service-due' | 'overdue'
}

export type Driver = {
  id: Id
  name: string
  phone: string
  vehicleId: Id | null
  licenceExpiryDay: number
  availability: 'on-shift' | 'off' | 'leave'
}

export type Client = {
  id: Id
  name: string
  industry: string
  contact: string
  email: string
  city: string
  manager: string
  status: 'active' | 'paused'
  lifetimeValue: Cents
}

export type Product = {
  id: Id
  sku: string
  name: string
  category: 'packaging' | 'pallets' | 'labels' | 'cold-chain' | 'safety'
  unit: string
  price: Cents
  reorderPoint: number
  stock: { locationId: Id; onHand: number; reserved: number }[]
}

export type OrderStatus = 'received' | 'ready' | 'in-fulfilment' | 'completed' | 'cancelled'
export type OrderEvent = { status: OrderStatus; at: DemoTime; note?: string }
export type Order = {
  id: Id
  number: string
  clientId: Id
  source: 'api' | 'portal' | 'csv' | 'manual'
  service: 'regular' | 'express' | 'same-day'
  originId: Id
  destination: string
  packages: { label: string; contents: string; weightKg: number }[]
  total: Cents
  status: OrderStatus
  placedAt: DemoTime
  events: OrderEvent[]
  shipmentId: Id | null
}

export type ShipmentStatus = 'scheduled' | 'in-transit' | 'out-for-delivery' | 'delivered' | 'delayed'
export type Stop = { address: string; eta: DemoTime; deliveredAt: DemoTime | null }
export type Shipment = {
  id: Id
  number: string
  vehicleId: Id
  driverId: Id
  originId: Id
  orderIds: Id[]
  stops: Stop[]
  status: ShipmentStatus
}

export type Settings = {
  companyName: string
  timezone: string
  units: 'metric' | 'imperial'
  deliveryConfirmations: boolean
  proofOfDelivery: boolean
}

export type Dataset = {
  locations: Location[]
  vehicles: Vehicle[]
  drivers: Driver[]
  clients: Client[]
  products: Product[]
  orders: Order[]
  shipments: Shipment[]
  settings: Settings
}
```

- [ ] **Step 2: The format helpers**

`src/lib/format.ts`: `DEMO_TODAY = '2026-07-14'`; `money(cents: Cents): string` (`$1,234.50`, `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })`); `compactMoney(cents)` (`$45.6k`); `dateOf(t: DemoTime): Date` (UTC from `DEMO_TODAY` plus `t.day`, at `t.time`); `shortDate(t)` (`12 Jul`); `dateTime(t)` (`12 Jul · 09:30`); `weight(kg)` (`1,990 kg`). Unit-test each in `tests/format.test.ts`, including a negative cents value and day `-31` crossing into June.

- [ ] **Step 3: The seed**

Write the counts in the spec (4 locations, 12 vehicles, 10 drivers, 14 clients, 24 products, 60 orders, 18 shipments) by hand, in one file per entity, following these rules so the screens have something to show:

- Orders: statuses spread as received 6, ready 14, in-fulfilment 18, completed 20, cancelled 2 (amended in Task 6: the first draft's 8 in-fulfilment orders could not fill 13 active shipments, nor 30 completed orders fit 5 delivered shipments of four); numbers `OR-2001` to `OR-2060`; placed over days `-14` to `0`; every order's `events` start with `received` at `placedAt` and walk forward to its status; `OR-2041` is `ready`, Bloom & Stem, Express, Harbour Hub to 199 Water St, two packages (the wireframe's detail page).
- Shipments: 18, statuses scheduled 4, in-transit 5, out-for-delivery 3, delivered 5, delayed 1; delivered ones carry four `completed` orders each, active ones one or two `in-fulfilment` orders, with one stop per order; delivered stops have `deliveredAt`.
- Vehicles: conditions excellent 6, good 3, service-due 2, overdue 1; status on-route 7, loading 2, idle 2, workshop 1; three with `nextServiceDay` within 7.
- Products: four below their reorder point at some location.
- Locations: Riverside DC 78% used, Harbour Hub 54%, North Yard and Market Street in between; zones per site, one over 85%.
- Names: invented and plain (Coastal Grocers, Bloom & Stem, Northside Hardware, Little Bay Bakery, Aster Living, Summit Office Supply, …); people by initial and surname.

`seed/index.ts` exports `SEED: Dataset` and `SEED_VERSION = 1`.

- [ ] **Step 4: The seed's own test**

`tests/seed.test.ts`: every foreign key resolves (order client and origin, shipment vehicle, driver, origin and orders, vehicle home location and driver, product stock locations); ids and numbers are unique; the status spreads above hold; every order's last event matches its status; totals are positive integers. Run, fix the seed until it passes, commit `chore(example): the demo dataset`.

### Task 7: The store

**Files:**
- Create: `src/lib/data/store.svelte.ts`
- Test: `tests/store.test.ts`

- [ ] **Step 1: The failing tests**

```ts
import { beforeEach, describe, expect, it } from 'vitest'

import { SEED } from '../src/lib/data/seed/index.js'
import { createStore, STORAGE_KEY } from '../src/lib/data/store.svelte.js'

beforeEach(() => localStorage.clear())

describe('the store', () => {
  it('starts from a copy of the seed', () => {
    const store = createStore()
    expect(store.data.orders).toHaveLength(SEED.orders.length)
    store.data.orders.pop()
    expect(SEED.orders).toHaveLength(60)
  })

  it('reads what an earlier visit saved', () => {
    const first = createStore()
    first.data.settings.companyName = 'Renamed'
    first.save()
    expect(createStore().data.settings.companyName).toBe('Renamed')
  })

  it('discards a store saved under another version', () => {
    localStorage.setItem('mise-logistics-demo:v0', JSON.stringify({ orders: [] }))
    expect(createStore().data.orders).toHaveLength(60)
    expect(STORAGE_KEY).toBe('mise-logistics-demo:v1')
  })

  it('ignores a saved store that does not parse', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    expect(createStore().data.orders).toHaveLength(60)
  })

  it('resets to the seed and forgets the saved copy', () => {
    const store = createStore()
    store.data.orders = []
    store.save()
    store.reset()
    expect(store.data.orders).toHaveLength(60)
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
```

- [ ] **Step 2: The store**

```ts
/**
 * Every collection the demo has, in one $state object. Read once from
 * localStorage (or copied from the seed), written back by save(), which the
 * layout calls from a debounced $effect. The key carries SEED_VERSION, so a
 * visitor's store from an older seed shape is ignored, not misread.
 */
import { SEED, SEED_VERSION } from './seed/index.js'
import type { Dataset } from './types.js'

export const STORAGE_KEY = `mise-logistics-demo:v${SEED_VERSION}`

const copy = <T>(value: T): T => structuredClone(value)

function load(): Dataset {
  try {
    const saved = globalThis.localStorage?.getItem(STORAGE_KEY)
    return saved ? (JSON.parse(saved) as Dataset) : copy(SEED)
  } catch {
    return copy(SEED)
  }
}

export function createStore() {
  const state = $state({ data: load() })
  return {
    get data() {
      return state.data
    },
    set data(next: Dataset) {
      state.data = next
    },
    save() {
      globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify($state.snapshot(state.data)))
    },
    reset() {
      state.data = copy(SEED)
      globalThis.localStorage?.removeItem(STORAGE_KEY)
    },
  }
}

export type Store = ReturnType<typeof createStore>

/** The app's one store. Tests create their own. */
export const store = createStore()
```

The store test sets `data.orders = []` through the setter defined here, so the setter stays.

- [ ] **Step 3: Persist from the layout**

In `+layout.svelte`: an `$effect` that reads `$state.snapshot(store.data)` (to track every change) and calls `store.save()` after a 300 ms debounce, clearing its timer on cleanup.

- [ ] **Step 4: Test and commit**

`pnpm --filter mise-logistics-example test:unit` passes. Commit `chore(example): the persisted demo store`.

### Task 8: Repositories and derived figures

**Files:**
- Create: `src/lib/data/{orders,shipments,fleet,products,warehouses,clients,settings,latency}.ts`
- Test: `tests/repositories.test.ts`

**Interfaces (every function takes the store first, so tests pass their own):**

- `latency(ms = 250): Promise<void>`; `setLatency(ms: number)` for tests (set to 0 in `tests/setup.ts`).
- orders: `listOrders(s, { search?, status? }): Order[]` (newest first); `getOrder(s, id): Order | undefined` (by id or number); `orderStats(s): Record<'received' | 'ready' | 'in-fulfilment' | 'completed', { count: number; trend: number[] }>` (trend = counts per day over the last 7 days); `ordersByStatus(s): Record<OrderStatus, Order[]>` (for the board); `createOrder(s, input: NewOrder): Order` (next number, `received`, `placedAt` day 0 now-ish fixed time `'12:00'`, one event); `cancelOrder(s, id): Order` (appends a `cancelled` event; throws for completed or already cancelled).
- shipments: `listShipments(s, filters)`, `getShipment(s, id)`, `activeShipments(s)` (not delivered), `shipmentProgress(sh): number` (delivered stops ÷ stops × 100, rounded).
- fleet: `listVehicles(s, filters)`, `fleetStatus(s)` (counts and shares per `VehicleStatus`), `fleetCondition(s)` (counts and shares per condition), `serviceDueSoon(s, withinDays = 7): Vehicle[]`.
- products: `listProducts(s, filters)`, `productStock(p): { onHand; reserved; available }` (summed over locations), `lowStock(s): Product[]` (available below `reorderPoint`), `updateProduct(s, id, patch: Pick<Product, 'price' | 'reorderPoint'>)`.
- warehouses: `listLocations(s)`, `utilisation(l): number` (sum used ÷ sum capacity × 100), `zoneShare(z): number`.
- clients: `listClients(s, filters)`, `getClient(s, id)`, `clientOrders(s, id)`, `openOrderValue(s, id): Cents`, `createClient(s, input: NewClient): Client`.
- settings: `getSettings(s)`, `saveSettings(s, next: Settings)`.
- overview: `pipeline(s)` (counts for packed = ready, shipped = in-fulfilment, delivered = completed, with each as a share of their sum), `deliveryTrend(s): { day: string; delivered: number; placed: number }[]` (last 7 days).

- [ ] **Step 1: Tests first**

Write `tests/repositories.test.ts` with one `describe` per module, against `createStore()` (fresh seed each test). Assert the seed's known figures (for example `orderStats(s).ready.count === 14`, `fleetStatus(s)['on-route'].count === 7`, `lowStock(s).length === 4`, `getOrder(s, 'OR-2041')?.status === 'ready'`), the trend lengths (7), `createOrder` numbering `OR-2061` and appearing first in `listOrders`, `cancelOrder` throwing on a completed order, `updateProduct` changing only the two fields, `shipmentProgress` rounding, and search matching order number and client name case-insensitively.

- [ ] **Step 2: Implement until green, then commit**

Pure functions over `s.data`; no `Date.now()`. Commit `chore(example): repositories and the demo's derived figures`.

### Task 9: Schemas, and Reset demo data

**Files:**
- Create: `src/lib/data/schemas.ts`
- Modify: `src/lib/components/app-sidebar.svelte`
- Test: `tests/schemas.test.ts`

- [ ] **Step 1: Schemas and their tests**

zod 4 schemas: `newOrderSchema` (clientId required, service enum, originId required, destination min 3, weightKg > 0, total integer cents ≥ 0), `productPatchSchema` (price integer ≥ 0, reorderPoint integer ≥ 0), `newClientSchema` (name min 2, industry, contact, email `z.email()`, city), `settingsSchema` (companyName min 2, timezone in a fixed list of 8, units enum, two booleans). `createOrder`, `updateProduct`, `createClient`, `saveSettings` call `.parse` on their input. Tests: one valid and one invalid input per schema, and a write function throwing on invalid input.

- [ ] **Step 2: Reset**

The sidebar's "Reset demo data" opens an `AlertDialog` ("Reset the demo? Every order, product and setting you changed goes back to the start."), whose action calls `store.reset()` and `toast.success('Demo data reset')`.

- [ ] **Step 3: Gate, commit, phase report**

Commit `chore(example): validation, and resetting the demo`. Phase 2 report: test counts, and a reset demonstrated in the browser (create an order through the console helper `window.__demo` — exposed only in dev — reload, see it kept, reset, see it gone).

---

## Phase 3: Board, in mise

### Task 10: The Board component

A mise addition, so it follows mise's own process, not this plan's.

- [ ] **Step 1:** Write `docs/superpowers/plans/2026-11-09-board.md` with the authors-components skill: group `data-display`, folder `board`, parts `Board`, `BoardColumn` (title, count, `tone`), `BoardCard` (a `Card`-surfaced item; `href` makes it a link); horizontal scroll on narrow screens; read-only (no drag); `Origin:` handling decided with the user, since Board has no React origin and `tests/provenance.test.ts` requires one (the authors-components skill says to ask). Present the plan; implement only on approval.
- [ ] **Step 2:** Implement per that plan: tests, stories on the skeleton, barrel, `EXPECTED_EXPORTS`, `pnpm build:skill`, the skill index entry ("Columns of cards by status: `Board`"), screenshots. Commit `feat(board): …` in mise. This is a `feat`, so it ships in mise's next release; the example uses it from the workspace immediately.

Phase 3 report and gate.

---

## Phase 4: overview and orders

Each screen task follows the same steps:

1. Read the components it uses in `skills/mise/components/*.md`, and the matching recipe in `skills/mise/recipes/` where one exists.
2. Build the page from the repositories (await `latency()` inside an `$effect` or a `{#await}`; render `StatTile loading` / `DataTable isLoading` meanwhile).
3. Add its routes to `scripts/routes.ts`.
4. `pnpm --filter mise-logistics-example check`, unit tests, `smoke`, read the screenshots in both schemes.
5. Commit `chore(example): the <screen> screen`.

A gap found in step 1 or 2 stops the task: report it and write a mise plan for it, as in Task 10.

### Task 11: Operations overview (`/`)

Per the spec and wireframe: four `StatTile`s (orders today from `orderStats`, on-time rate, active shipments, vehicles idle with `tone="warning"` when above 2) with `DeltaBadge` and `Sparkline`; Fleet status `Card` (`SegmentedBar` from `fleetStatus`, `FactList` of counts); Fulfilment pipeline `Card` (`Tabs` packed/shipped/delivered over `MetricBar`s from `pipeline`); Deliveries `Card` with the area chart from the dashboard recipe, two series (delivered, placed) from `deliveryTrend`; Fleet condition `Card` with four `RadialStat`s; Active shipments `DataTable` (vehicle, shipment, route, ETA, status `Badge`, `Progress`) with `footer` "View all" to `/shipments`. Layout: the grid classes from the wireframe.

### Task 12: Orders (`/orders`) and Create order

`StatTile` row from `orderStats` with sparklines; a `ToggleGroup` Table / Board (Board renders in Task 14; until then the toggle shows Table only); `DataTable` per the data-table recipe: order (number, `dateTime(placedAt)`, source `Badge`), client (`EntityLabel` + `Avatar` initials), route (origin → destination), service, packages and weight, total (`money`), status `Badge` (tone map in `src/lib/status.ts`), row actions (View, Cancel → `AlertDialog`); `onRowClick` navigates to the detail. **Create order** opens a `Sheet` holding `src/lib/components/order-form.svelte`: `Combobox` client, `Select` service and origin, `Input` destination, `QuantityInput` weight (kg/lb, metric per settings), `NumberInput format="currency"` total; validated with `newOrderSchema` (plain `Field` + `FieldError`, as the Inertia form recipe); on success `createOrder`, close, `toast.success`, the new row on top.

### Task 13: Order detail (`/orders/[id]`)

`getOrder` by number. Found: `PageHeader` with `breadcrumb` (Orders › number), `titleAccessory` status `Badge`, actions (Print — `window.print()` — and a `DropdownMenu` with Cancel order → `AlertDialog` → `cancelOrder`, disabled when not cancellable); a details `Card` with `FactList`; packages `Card` with `Table`; `AsideCard` for the shipment (link to `/shipments?open=<id>` or "Not yet assigned"); `Timeline` of events, newest first. Not found: `ErrorState` (not found, with a link back to Orders). Add `/orders/OR-2041` and `/orders/does-not-exist` to the routes.

### Task 14: The orders board

With `Board` from Phase 3: four `BoardColumn`s (received, ready, in-fulfilment, completed; cancelled hidden) from `ordersByStatus`, each `BoardCard` an order (number, client, total, service) linking to the detail. The toggle state is kept in the URL (`?view=board`) so it survives reload and is shareable.

Phase 4 report and gate.

---

## Phase 5: operations and partners

Same steps as Phase 4.

### Task 15: Shipments (`/shipments`)

`DataTable` (shipment, vehicle and driver, origin, stops count, next ETA, status `Badge`, `Progress` with `shipmentProgress`); search and status and driver filters; `onRowClick` opens a `Sheet`: header with number and vehicle/driver, `Progress`, `Timeline` of stops (delivered ones with their time, the rest with ETA and muted), the orders carried as links. `?open=<id>` opens the sheet on load (the order detail links here).

### Task 16: Fleet (`/fleet`)

An `Alert tone="warning"` listing `serviceDueSoon` when non-empty; `DataTable` with `viewMode` bound to a table/grid toggle in the toolbar; table columns: vehicle, registration, type, driver, home, status `Badge`, mileage, next service (warning `Badge` within 7 days); grid view's `card` snippet is `src/lib/components/vehicle-card.svelte` (a `Card` with the code, status, registration, home, driver, mileage, next service).

### Task 17: Products (`/products`)

`Alert` for `lowStock`; `DataTable`: product, SKU, category (`Badge` outline), stock as a `SegmentedBar` (available, reserved) with "on hand / reserved" under it, price, status (In stock / Low / Out), row action Edit → `Dialog` with `NumberInput format="currency"` price and `NumberInput controls` reorder point, validated by `productPatchSchema`, saved with `updateProduct` and a toast.

### Task 18: Warehouses (`/warehouses`)

`CardGrid columns={2}` of warehouse cards (`src/lib/components/warehouse-card.svelte`): title with a `RadialStat` of `utilisation`, a `FactList` (manager, docks, SKUs stocked there, units), and a `MetricBar` per zone with `tone="warning"` above 85%.

### Task 19: Clients (`/clients`)

`DataTable`: client (`EntityLabel`, industry as description), contact, city, orders count, open order value, lifetime value, status `Badge`; filters status and manager; `onRowClick` opens a `Sheet` with a `FactList` and a recent-orders `Table` (five, linking to details); **Add client** opens a `Dialog` form (`newClientSchema`) saved with `createClient`.

Phase 5 report and gate.

---

## Phase 6: settings, search, and the finish

### Task 20: General settings (`/settings/general`)

`mise/form` with superforms in SPA mode (`superForm(defaults(getSettings(store), zod4(settingsSchema)), { SPA: true, validators: zod4(settingsSchema), dataType: 'json', onUpdate })`), as the form-sveltekit recipe and the Form story: `Input` company name, `Select` timezone, `ToggleGroup` units, two `SwitchField`s; on a valid update `saveSettings` and `toast.success('Settings saved')`. The company name appears in the sidebar header, so a change shows immediately.

### Task 21: ⌘K search

The header's search button and ⌘K open a `CommandDialog` with three `CommandGroup`s (Orders, Clients, Products) over `listOrders`, `listClients`, `listProducts` with the typed query, and a "Go to" group of the navigation items; choosing navigates.

### Task 22: States, the README link, and the handoff

- Every list screen: the `DataTable`'s `emptyState` for a search with no match, and a loading state from `latency()`. Verify each in the smoke screenshots (add `?q=zzzz` routes for two tables).
- `examples/logistics/README.md`: what it is, `pnpm dev:example`, how mise is consumed (workspace, built `dist/`, the generated theme), the data layer and reset, the gap rule.
- mise's `README.md`: a "See it in an app" line under the title linking to `https://jovertical.github.io/mise-design-system/`, and the same `homepage` in `package.json` if the user agrees (it currently points at the README).
- `docs/handoff.md`: the example's state and where it lives; `CLAUDE.md`/`AGENTS.md`: `pnpm dev:example` and that example changes are `chore(example)`.

### Task 23: The final smoke run

`pnpm build && pnpm --filter mise-logistics-example smoke`, then read every screenshot (9 screens + 2 detail routes + 2 empty searches, light and dark). Fix what looks wrong; commit; Phase 6 report with a contact sheet; push on approval and confirm the Pages deploy and a deep link on the live site.
