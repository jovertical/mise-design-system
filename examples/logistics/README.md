# mise Logistics (demo)

A logistics operations app built only from mise, on mock data you can change.
Live at <https://jovertical.github.io/mise-design-system/>.

Nine screens: an operations overview, orders (table, board, detail, create and
cancel), shipments with their stops, the fleet as a table or cards, products
and stock, warehouses and their zones, clients, and general settings, with a
⌘K search over all of it.

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
- **No local look-alikes.** `src/lib/components/` holds compositions for this app
  only (a vehicle card, the order form, the search palette). When a screen needs
  something mise does not have, it is added to mise first: `Board` and the
  `SidebarInset` fix came from here.

## The data

- `src/lib/data/seed/` is a fixed, hand-written dataset: 60 orders, 18
  shipments, 12 vehicles, 24 products and the rest, dated relative to
  `DEMO_TODAY` so the demo never looks stale. Money is integer cents.
- `src/lib/data/store.svelte.ts` holds it in one `$state` object, saved to
  `localStorage` a moment after any change. **Reset demo data** in the user menu
  puts the seed back.
- Pages read and change data only through the functions in `src/lib/data/*.ts`,
  which compute every figure on screen and are unit-tested against the seed.
  Writes go through the zod schemas in `schemas.ts`, the same ones the forms use.

## Deploying

`.github/workflows/example.yml` builds mise, then this app with
`BASE_PATH=/mise-design-system`, and deploys `build/` to GitHub Pages on every
push to `main` that touches mise or the example. It is a single-page app:
adapter-static writes `404.html`, which Pages serves for any deep link.
