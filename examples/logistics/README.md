# mise Logistics (demo)

A logistics operations app built only from mise, on mock data you can change.
Live at <https://jovertical.github.io/mise-design-system/>.

Nine screens: an operations overview, orders (table, board, detail and
cancel), shipments with their stops, the fleet as a table or cards, products
and stock, warehouses and their zones, clients, and general settings, with a
⌘K search over all of it. Every order, shipment, vehicle, product, client and
site also has a create page and an edit page.

## Run it

From the repository root:

```sh
pnpm install
pnpm dev:example      # builds mise, then rebuilds it on save beside the app's dev server
```

The app is on <http://localhost:5180>. `pnpm --filter mise-logistics-example smoke`
builds it and opens every route in light and dark with a headless Chromium,
saving screenshots to `.smoke/`.

## How it uses mise

- **Like any app.** It depends on `"@jovertical/mise-design-system": "workspace:*"`,
  so it imports the built package through its `exports`, never mise's source.
  Changing mise means rebuilding it (`pnpm build` at the root, or the watcher in
  `pnpm dev:example`); nothing is copied into `node_modules`.
- **Its own theme.** `mise.theme.js` (teal on stone, `0.5rem` radius) is turned
  into `src/mise-theme.css` by `pnpm theme`, which `src/app.css` imports in place
  of mise's `theme.css`. A test fails when the committed file is stale.
- **No local look-alikes.** The modules' `components/` folders hold compositions
  for this app only (a vehicle card, the entity forms, the search palette). When a screen needs
  something mise does not have, it is added to mise first: `Board` and the
  `SidebarInset` fix came from here.

## Modules

The app's code lives in `src/modules/<module>/`, one module per screen area,
each with `components/`, `data/` and `utils/` as it needs them, imported as
`#modules/<module>/…`:

| Module | What it holds |
| --- | --- |
| `orders`, `shipments`, `fleet`, `products`, `warehouses`, `clients`, `settings` | an entity: its forms and cards, its reads and writes, schema, readiness rows and types, and its status labels |
| `overview` | the overview's cards and the figures behind them |
| `core` | the store, the seed, the shared types and helpers, formatting, and the create-and-edit frame every form uses |
| `shell` | the header, sidebar, search palette, user menu, navigation and breadcrumb |

`src/routes/` only arranges what the modules provide.

## The data

- `src/modules/core/data/seed/` is a fixed, hand-written dataset: 60 orders, 18
  shipments, 12 vehicles, 24 products and the rest, dated relative to
  `DEMO_TODAY` so the demo never looks stale. Money is integer cents.
- `src/modules/core/data/store.svelte.ts` holds it in one `$state` object, saved to
  `localStorage` a moment after any change. **Reset demo data** in the user menu
  puts the seed back.
- Pages read and change data only through the functions in
  `src/modules/<entity>/data/index.ts`, one module per entity,
  which compute every figure on screen and are unit-tested against the seed.
  Writes go through the zod schema in the entity's `schema.ts`, the same one its
  form uses.

## Create and edit pages

Each entity has `/<list>/new` and `/<list>/[id]/edit`, laid out as the client
portal lays its own: a way back above the title, Cancel and Save in the header,
the form in a two-thirds card split into sections, and a live summary and a
readiness checklist beside it.

- **One form per entity** (`src/modules/<entity>/components/<entity>-form.svelte`) draws the
  whole page through `form-page.svelte`; both routes render it, the edit route
  inside `{#key}` so moving between two records starts afresh.
- **superforms and `mise/form`.** `entityForm()` in `src/modules/core/utils/entity-form.svelte.ts`
  sets up every form the same way: in the browser (SPA), as JSON so packages
  and zones stay arrays, validated by the entity's schema. The same schema is
  parsed again by the store's `create…` and `update…`, which also refuse what a
  schema cannot know (a SKU in use, a zone shrunk below what it holds) with a
  sentence that becomes a toast.
- **Leaving with unsaved changes asks first**, through a "Discard changes?"
  dialog; a save, or a form left as it was, leaves without asking.
- **Readiness rows** come from each entity's `readiness.ts`, pure functions of
  the form's values, tested without rendering.
- **What can't be edited** gets a stop instead of the form: a completed or
  cancelled order, and a shipment that has left. A shipment is planned as a
  run: an origin, a vehicle, a driver and the ready orders it carries, whose
  stops follow from the orders.

## Deploying

`.github/workflows/example.yml` builds mise, then this app with
`BASE_PATH=/mise-design-system`, and deploys `build/` to GitHub Pages on every
push to `main` that touches mise or the example. It is a single-page app:
adapter-static writes `404.html`, which Pages serves for any deep link.
