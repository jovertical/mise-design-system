# Create and edit pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. In this repo the user has chosen inline execution in the main session.

**Goal:** Create and edit pages for orders, clients, products, vehicles, sites and shipments in the logistics example, in the client portal's shape.

**Architecture:** One shared frame (`form-page.svelte`) draws the header, the two-thirds/one-third grid and the unsaved-changes dialog; each entity has one form component used by its `new` and `[id]/edit` routes. Every form is a superForm in SPA mode built by one helper (`entityForm`) and drawn with `mise/form`; it validates with one zod schema per entity, which the store's `create…`/`update…` functions also parse. Summary and readiness rows come from pure functions over the form's values, so they are unit-tested without rendering.

**Tech Stack:** SvelteKit 3 (SPA), Svelte 5, mise (workspace) and `mise/form`, sveltekit-superforms 3 (zod 4 adapter), zod 4, `@internationalized/date`, Vitest 5, Biome 2.6.

**Spec:** `docs/specs/2026-11-09-edit-pages-design.md`. Wireframes reviewed in the browser on 2026-11-09 (`.superpowers/brainstorm/`, git-ignored).

## Global Constraints

- All work is in `examples/logistics/`. Paths below are relative to it unless they start with `/`.
- UI comes from mise's public entry only. `src/lib/components/` holds compositions of mise parts. A missing mise part stops the phase; it goes into mise first under its own plan (spec P10).
- Money is integer cents; weights kg; dates are day offsets from `DEMO_TODAY = '2026-07-14'` (`src/lib/format.ts`). Never `new Date()` for data.
- Pages never write `store.data` directly; they call the `create…`/`update…` functions.
- Copy: sentence case, generic invented names, `$`.
- The seed does not change; `SEED_VERSION` stays.
- Commits are `chore(example)` (or `docs(example)` for docs), ending with the Co-Authored-By trailer. Commit only when `pnpm --filter mise-logistics-example test` exits 0 (after a root `pnpm build` if mise changed).
- Phases of at most 5 tasks. At each phase gate: `pnpm smoke` exits 0, the new pages are screenshotted in light and dark, a phase-gates report, and an explicit go. Push only after approval.
- Dependencies are installed by the user; none are expected.

## File map

| File | Responsibility |
| --- | --- |
| `src/lib/data/schemas.ts` | one schema per entity (`orderSchema`, `clientSchema`, `productSchema`, `vehicleSchema`, `siteSchema`, `shipmentSchema`) and their input types |
| `src/lib/data/{orders,clients,products,fleet,warehouses,shipments}.ts` | `create…`, `update…`, editability checks, form-value mappers |
| `src/lib/data/readiness.ts` | `<entity>Readiness(values): ReadinessItem[]` per entity |
| `src/lib/data/days.ts` | `dayToDate(offset): CalendarDate`, `dateToDay(date): number` |
| `src/lib/entity-form.svelte.ts` | `entityForm(…)`: the shared superForm setup, and the discard prompt's state |
| `src/lib/breadcrumb.svelte.ts` | gains `crumb.step` ("Edit", "New") |
| `src/lib/components/app-header.svelte` | renders `crumb.step` as the last breadcrumb item |
| `src/lib/components/form-page.svelte` | the frame: header, grid, guard |
| `src/lib/components/unsaved-changes-dialog.svelte` | "Discard changes?" |
| `src/lib/components/<entity>-form.svelte` | one per entity: sections, aside |
| `src/routes/<list>/new/+page.svelte`, `src/routes/<list>/[id]/edit/+page.svelte` | the twelve routes |
| `tests/schemas.test.ts`, `tests/repositories.test.ts`, `tests/readiness.test.ts`, `tests/days.test.ts` | Vitest |
| `scripts/routes.ts` | the smoke list |

## Shared interfaces (defined in Phase 1, used by every later task)

```ts
// src/lib/entity-form.svelte.ts
import type { SuperValidated } from 'sveltekit-superforms'

/** The discard prompt FormPage draws; the guard awaits the user's answer. */
export const discard = $state<{ open: boolean; resolve: ((leave: boolean) => void) | null }>(…)
export function askToDiscard(): Promise<boolean>   // opens the dialog, resolves on its answer

/**
 * One superForm per page, set up the same way everywhere: SPA (no server), json data
 * (arrays and nested values), the schema's validators, resetForm false, and
 * taintedMessage: askToDiscard. On a valid submit it calls onsave(values) and then
 * form.reset({ newState: values }), so the navigation onsave starts is not challenged.
 * onsave throwing (a write refusing) toasts the message and keeps the form as it is.
 */
export function entityForm<S extends z.ZodObject>(
  schema: S,
  initial: z.infer<S>,
  onsave: (values: z.infer<S>) => void,
): SuperForm<z.infer<S>>

// src/lib/data/readiness.ts — ReadinessItem is mise's type
import type { ReadinessItem } from '@jovertical/mise-design-system'
```

```svelte
<!-- src/lib/components/form-page.svelte props -->
{
  title: string            // "Edit order"
  description: string
  back: { href: string; label: string }   // "Back to OR-2058"
  formId: string           // "order-form"
  submitLabel: string      // "Save changes"
  form: Snippet            // the <form id={formId}> and its Card
  aside: Snippet           // the AsideCards
}
```

Each entity has one editor, `<entity>-form.svelte`, which builds its superForm once in its script and draws the whole page:

```ts
// props of every <entity>-form.svelte
{
  initial: <Entity>Input              // empty values for new, <entity>ToInput(record) for edit
  page: { title: string; description: string; back: { href: string; label: string }; submitLabel: string }
  save: (values: <Entity>Input) => void   // calls create… or update…, toasts, goto(detail)
  // plus read-only context where the entity needs it (an order's lookups come from the store)
}
```

Inside: `const form = entityForm(<entity>Schema, untrack(() => initial), (values) => save(values))`, `const { form: formData, enhance } = form`, then `<FormPage {...page} formId="<entity>-form">` with a `form` snippet (`<form method="POST" id="<entity>-form" use:enhance>` around a `Card` of sections) and an `aside` snippet (`<<Entity>Aside values={$formData} />`). Every field is `mise/form`'s `FormField {form} name="…"` › `FormControl` › the mise input with `bind:value={$formData.…}`, then `FormFieldErrors`. `<entity>-aside.svelte` takes `{ values }` (plus read-only context such as a client's lifetime value) and draws the Summary and Ready to save cards.

A route resolves the record, handles not found and not editable, and renders the editor inside `{#key record.id}`, so moving between two records' edit pages remounts the form with the right values.

The settings page (`src/routes/settings/general/+page.svelte`) is the working example of superForm + `mise/form` in this app: copy its `FormField` usage and its handling of `Select` and `NumberInput` inside `FormControl`.

---

## Phase 1: the frame, and orders

### Task 1: The order schema and writes

**Files:** Modify `src/lib/data/schemas.ts`, `src/lib/data/orders.ts`, `src/lib/components/order-form.svelte` (import rename only, until Task 3); Test `tests/schemas.test.ts`, `tests/repositories.test.ts`

**Interfaces — produces:**

```ts
export const orderSchema = z.object({
  clientId: z.string().min(1, 'Choose a client'),
  service: z.enum(['regular', 'express', 'same-day']),
  originId: z.string().min(1, 'Choose where it ships from'),
  destination: z.string().trim().min(3, 'Enter the delivery address'),
  packages: z.array(z.object({
    contents: z.string().trim().min(1, 'Say what is in it'),
    weightKg: z.number().positive('Enter a weight'),
  })).min(1, 'Add a package'),
  total: cents,
})
export type OrderInput = z.infer<typeof orderSchema>

createOrder(s, raw: OrderInput): Order          // labels PKG-1… by position
updateOrder(s, idOrNumber: string, raw: OrderInput): Order
isOrderEditable(order: Order): boolean          // received | ready
orderToInput(order: Order): OrderInput
```

`newOrderSchema` and `NewOrder` are removed.

- [ ] **Step 1: Tests first.** In `tests/schemas.test.ts`: `orderSchema` refuses an empty `packages` with "Add a package", a package with `weightKg: 0` with "Enter a weight", and accepts two packages. In `tests/repositories.test.ts` (fresh `createStore()` per test): `createOrder` with two packages stores labels `PKG-1`, `PKG-2`; `updateOrder(s, 'OR-2041', …)` changes destination, packages (relabelled) and total, keeps `number`, `status`, `events` and `placedAt`; `updateOrder` on a completed order throws "OR-… is completed and cannot be edited"; `orderToInput(getOrder(s, 'OR-2041')!)` round-trips through `orderSchema.parse`.
- [ ] **Step 2:** Run `pnpm test:unit` — the new cases fail.
- [ ] **Step 3: Implement.** `updateOrder` finds the order (throws "No order X"), refuses when `!isOrderEditable`, parses, assigns the fields, relabels packages. The existing Create order sheet keeps working by sending `packages: [{ contents: 'General freight', weightKg }]` until Task 4 removes it.
- [ ] **Step 4:** `pnpm test` exits 0. Commit `chore(example): the order schema takes packages, and orders can be updated`.

### Task 2: The frame, the guard and the breadcrumb step

**Files:** Create `src/lib/entity-form.svelte.ts`, `src/lib/components/form-page.svelte`, `src/lib/components/unsaved-changes-dialog.svelte`; Modify `src/lib/breadcrumb.svelte.ts`, `src/lib/components/app-header.svelte`

- [ ] **Step 1: `entity-form.svelte.ts`.**

```ts
import { toast } from '@jovertical/mise-design-system'
import { defaults, superForm } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'
import type { z } from 'zod'

export const discard = $state<{ open: boolean; resolve: ((leave: boolean) => void) | null }>({
  open: false,
  resolve: null,
})

export function askToDiscard(): Promise<boolean> {
  return new Promise((resolve) => {
    discard.resolve = resolve
    discard.open = true
  })
}

export function answerDiscard(leave: boolean) {
  discard.open = false
  discard.resolve?.(leave)
  discard.resolve = null
}

export function entityForm<S extends z.ZodObject>(
  schema: S,
  initial: z.infer<S>,
  onsave: (values: z.infer<S>) => void,
) {
  const adapter = zod4(schema)
  const form = superForm(defaults(structuredClone(initial), adapter), {
    SPA: true,
    applyAction: false,
    dataType: 'json',
    resetForm: false,
    validators: adapter,
    taintedMessage: askToDiscard,
    onUpdate({ form: result }) {
      if (!result.valid) return
      try {
        form.reset({ newState: result.data })
        onsave(result.data)
      } catch (error) {
        form.reset({ newState: initial })
        toast.error(error instanceof Error ? error.message : 'Could not save')
      }
    },
  })
  return form
}
```

Check `toast`'s import against the settings page (it may come from `svelte-sonner` through mise's `Toaster`); use what that page uses. If the reset-before-save order lets a refused write leave the form untainted, set the values back with `form.form.set(result.data, { taint: true })` instead of the second reset, and say so in the phase report.

- [ ] **Step 2: Breadcrumb step.** `crumb` becomes `$state<{ leaf: string | null; step: string | null }>`; add `markThisPage(step: string, leaf?: () => string | undefined)` that sets both and clears them on teardown. In `app-header.svelte`, when `crumb.step` is set, the record (if any) renders as a `BreadcrumbLink` to the path without its last segment, followed by `BreadcrumbPage` of the step; on `/x/new` the record is omitted and the leaf is the step.
- [ ] **Step 3: `unsaved-changes-dialog.svelte`.** No props; reads `discard` from `entity-form.svelte.ts`. mise `AlertDialog` with `open={discard.open}` and `onOpenChange={(open) => { if (!open) answerDiscard(false) }}`: title "Discard changes?", description "Your changes haven't been saved.", `AlertDialogCancel` "Keep editing" (answers `false`), `AlertDialogAction tone="critical"` "Discard" (answers `true`).
- [ ] **Step 4: `form-page.svelte`** with the props in Shared interfaces:

```svelte
<PageLayout>
  <PageHeader {title} {description}>
    {#snippet backLink()}<a href={back.href} class="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm"><ArrowLeft class="size-4" />{back.label}</a>{/snippet}
    {#snippet actions()}
      <Button variant="outline" href={back.href}>Cancel</Button>
      <Button type="submit" form={formId}>{submitLabel}</Button>
    {/snippet}
  </PageHeader>
  <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
    <div class="lg:col-span-2">{@render form()}</div>
    <div class="flex flex-col gap-6">{@render aside()}</div>
  </div>
</PageLayout>
<UnsavedChangesDialog />
```

Cancel is a link, so the guard asks before it leaves a dirty form.

- [ ] **Step 5:** Nothing renders these yet, so the check is `pnpm test` (svelte-check, Biome, Vitest) exiting 0. Commit `chore(example): a create-and-edit page frame with an unsaved-changes guard`.

### Task 3: The order form

**Files:** Rewrite `src/lib/components/order-form.svelte`; Create `src/lib/components/order-aside.svelte`, `src/lib/data/readiness.ts`; Test `tests/readiness.test.ts`

**Interfaces — produces:** `orderReadiness(values: OrderInput): ReadinessItem[]`. Rows, all `required: true`: "Client chosen" (`clientId` set), "Origin and delivery address" (both set, destination at least 3 characters), "At least one package with a weight" (some `weightKg > 0`), "Total set" (`total > 0`).

- [ ] **Step 1: Tests first.** The new-order initial values (Task 4) have all four unmet except the origin row's origin half; a full order has all met; one package with `weightKg: 0` leaves the package row unmet. (Read `ReadinessItem`'s fields from `node_modules/@jovertical/mise-design-system/dist/components/feedback/readiness/*.d.ts` and match them.)
- [ ] **Step 2: The form.** `order-form.svelte` with the editor props in Shared interfaces. Inside its `form` snippet, `<form method="POST" id="order-form" use:enhance>` and one `Card` with `CardContent class="flex flex-col gap-6"`; four sections separated by `Separator`, each:

```svelte
<section class="flex flex-col gap-4">
  <div>
    <CardTitle iconTone="primary">{#snippet icon()}<Users />{/snippet}Client and service</CardTitle>
    <Text as="p" size="sm" muted>Who it is for and how fast it goes.</Text>
  </div>
  <div class="grid gap-4 sm:grid-cols-2">
    <FormField {form} name="service">
      <FormControl>
        {#snippet children({ props })}
          <FormLabel>Service</FormLabel>
          <Select type="single" bind:value={$formData.service} items={services}>
            <SelectTrigger {...props} class="w-full"><SelectValue /></SelectTrigger>
            …
          </Select>
        {/snippet}
      </FormControl>
      <FormFieldErrors />
    </FormField>
  </div>
</section>
```

Fields as in the spec's Orders table, carried over from the current form (client `Combobox` with its search, service and origin `Select`, destination `Input`, total `NumberInput format="currency" prefix="$"`). Packages: `{#each $formData.packages as _, index}` a row of a `Badge variant="outline"` `PKG-{index + 1}`, a `FormField {form} name="packages[{index}].contents"` with an `Input`, a `FormField … name="packages[{index}].weightKg"` with a `NumberInput` suffix `kg`, and a ghost `iconOnly` remove `Button` (`aria-label="Remove PKG-{n}"`, disabled when one row is left) that sets `$formData.packages = $formData.packages.toSpliced(index, 1)`; then a ghost "Add package" `Button` that appends `{ contents: '', weightKg: 0 }`. The array's own error ("Add a package") shows under the list with `FormFieldErrors` on a `FormField name="packages"`; if `mise/form` has no array-level error part, read `$errors.packages?._errors` into a `FieldError` and note it as a candidate mise gap in the phase report.
- [ ] **Step 3: The aside.** Create `order-aside.svelte`: `AsideCard` "Summary" (icon `ReceiptText`) with a `FactList` of client name (or "—"), service label, "origin → destination", "{n} packages · {kg} kg", `money(total)`; `AsideCard` "Ready to save" (icon `ListChecks`) with `ReadinessSummary` and `ReadinessChecklist` of `orderReadiness(values)`. Props `{ values: OrderInput }`.
- [ ] **Step 4:** `pnpm test` exits 0. Commit `chore(example): the order form as a page, with packages, a summary and readiness`.

### Task 4: The order routes, and the sheet removed

**Files:** Create `src/routes/orders/new/+page.svelte`, `src/routes/orders/[id]/edit/+page.svelte`; Modify `src/routes/orders/+page.svelte`, `src/routes/orders/[id]/+page.svelte`, `scripts/routes.ts`

- [ ] **Step 1: `/orders/new`.** `markThisPage('New order')`. Initial values: `{ clientId: '', service: 'regular', originId: 'loc-riverside', destination: '', packages: [{ contents: '', weightKg: 0 }], total: 0 }`, passed to `<OrderForm {initial} page={…} {save} />`. `FormPage` title "New order", description "Who it is for, where it goes and what it carries.", back `{ href: resolve('/orders'), label: 'Back to Orders' }`, submit "Create order". `save`: `const order = createOrder(store, values); toast.success(\`${order.number} created\`); goto(resolve('/orders/[id]', { id: order.number }))`.
- [ ] **Step 2: `/orders/[id]/edit`.** `const order = $derived(getOrder(store, page.params.id))`. Unknown: the same `ErrorState` the detail page shows (404). Not editable: `ErrorState` title "{number} can't be edited", description "It is {status label}. Completed and cancelled orders are kept as they were.", `homeLink` a `Button href` "Back to {number}". Otherwise `markThisPage('Edit', () => order.number)`, `FormPage` title "Edit order", description "Change the client, route, packages or total. Status moves on its own.", back to the order, submit "Save changes"; `save` calls `updateOrder`, toasts "{number} saved" and goes to the detail page. Render `{#key order.id}<OrderForm initial={orderToInput(order)} … />{/key}`.
- [ ] **Step 3: Links.** Orders list: "Create order" becomes `<Button href={resolve('/orders/new')}>`; delete the `Sheet`, its state and imports, and the doc comment's sheet sentence. Order detail: an outline "Edit" `Button href` in `actions` when `isOrderEditable(order)`, ahead of Cancel order.
- [ ] **Step 4: Smoke.** `ROUTES` gains `/orders/new`, `/orders/OR-2041/edit`; `NOT_FOUND_ROUTES` gains `/orders/does-not-exist/edit`.
- [ ] **Step 5:** `pnpm test` and `pnpm smoke` exit 0; look at `.smoke/orders-new-*.png` and `.smoke/orders-or-2041-edit-*.png`. Commit `chore(example): create and edit orders on their own pages`.

**Phase 1 gate.** Screenshots of New order, Edit order, the cancelled-order stop and the discard dialog (flip its `open` default for the shot, then revert), light and dark. Report and wait.

---

## Phase 2: clients and products

### Task 5: Client schema, writes and readiness

**Files:** Modify `src/lib/data/schemas.ts`, `src/lib/data/clients.ts`, `src/lib/data/readiness.ts`; Tests as above

**Produces:**

```ts
export const clientSchema = z.object({
  name: z.string().trim().min(2, 'Name the client'),
  industry: z.string().trim().min(1, 'Enter an industry'),
  city: z.string().trim().min(1, 'Enter a city'),
  contact: z.string().trim().min(1, 'Name a contact'),
  email: z.email('Enter an email address'),
  manager: z.string().trim().min(1, 'Name the account manager'),
  status: z.enum(['active', 'paused']),
})
export type ClientInput = z.infer<typeof clientSchema>
createClient(s, raw: ClientInput): Client      // id as today; lifetimeValue 0
updateClient(s, id: Id, raw: ClientInput): Client
clientToInput(client: Client): ClientInput
clientReadiness(values: ClientInput): ReadinessItem[]   // "Named", "Contact and email", "City", "Account manager"
```

`newClientSchema`/`NewClient` are removed; the Add client dialog sends `manager: 'Ops manager', status: 'active'` until Task 6.

- [ ] Tests first (refusals with their messages; `updateClient` keeps `id` and `lifetimeValue`; round-trip), implement, `pnpm test`, commit `chore(example): the client schema covers the account, and clients can be updated`.

### Task 6: The client form and routes

**Files:** Create `src/lib/components/client-form.svelte`, `client-aside.svelte`, `src/routes/clients/new/+page.svelte`, `src/routes/clients/[id]/edit/+page.svelte`; Modify `src/routes/clients/+page.svelte`, `src/routes/clients/[id]/+page.svelte`, `scripts/routes.ts`

- [ ] Form on the Task 3 pattern. Sections: Company (icon `Building2`: name, industry, city in `sm:grid-cols-3`), Contact (`UserRound`: contact, email), Account (`BadgeCheck`: manager `Input`; `SwitchField` "Active" with description "Paused clients can't be chosen for new orders", bound to `status === 'active'`). Aside: Summary `FactList` (name, industry, contact, email; on edit also lifetime value and open-order value via a `context` prop `{ lifetimeValue: Cents; openValue: Cents } | null`), Ready to save.
- [ ] Routes: new (title "New client", back to Clients, submit "Add client", initial manager "Ops manager", status active, toast "{name} added"); edit (title "Edit client", back to the client by name, `markThisPage('Edit', () => client.name)`, submit "Save changes"). Every client is editable.
- [ ] Clients list: "Add client" becomes a link to `/clients/new`; delete the dialog. Client detail: an outline "Edit" button.
- [ ] Smoke gains `/clients/new`, `/clients/cli-coastal-grocers/edit`. `pnpm test`, `pnpm smoke`, commit `chore(example): create and edit clients on their own pages`.

### Task 7: Product schema, writes and readiness

**Produces:**

```ts
export const productSchema = z.object({
  name: z.string().trim().min(2, 'Name the product'),
  sku: z.string().trim().min(3, 'Enter a SKU').regex(/^[A-Z0-9-]+$/, 'Capitals, digits and dashes only'),
  category: z.enum(['packaging', 'pallets', 'labels', 'cold-chain', 'safety']),
  unit: z.string().trim().min(1, 'Enter a unit'),
  price: cents,
  reorderPoint: z.number().int().min(0, 'Cannot be negative'),
  openingStock: z.array(z.object({ locationId: z.string(), onHand: z.number().int().min(0, 'Cannot be negative') })),
})
export type ProductInput = z.infer<typeof productSchema>
createProduct(s, raw: ProductInput): Product   // id `prd-<sku lower>`; stock from openingStock, reserved 0; a location missing from openingStock gets 0
updateProduct(s, id: Id, raw: ProductInput): Product   // ignores openingStock; stock unchanged
productToInput(product: Product): ProductInput          // openingStock = current onHand per site
productReadiness(values): ReadinessItem[]                 // "Named", "SKU", "Price set", "Reorder point set"
```

Both writes throw "SKU {sku} is already in use" for another product's SKU. `productPatchSchema` is removed; the old dialog goes in Task 8, so update its call site to pass `{ ...productToInput(product), price, reorderPoint }` meanwhile.

- [ ] Tests first (SKU format and uniqueness on both writes; update leaves stock alone; create with opening stock across all four sites), implement, commit `chore(example): the product schema covers the whole product, and products can be created`.

### Task 8: The product form and routes

- [ ] Form sections: Product (`Package`: name, SKU with `oninput` uppercasing, category `Select`, unit), Pricing (`Tag`: price currency, reorder point `NumberInput`), Stock by site (`Warehouse`): on create a row per location with its name and an on-hand `NumberInput`; on edit a mise `Table` of location, on hand, reserved, read-only, with a muted line "Stock moves through adjustments, not this form." Aside Summary: price, total on hand, reorder point, a `Badge tone="warning"` "Low stock" when on hand is below it.
- [ ] Routes `/products/new` (submit "Add product", back to Products) and `/products/[id]/edit` (by SKU like the detail page; `markThisPage('Edit', () => product.name)`).
- [ ] Products list: a "New product" button in the header; the row menu's "Edit price and reorder point" becomes "Edit" linking to the edit page; delete the dialog and its state. Product detail: an outline "Edit" button.
- [ ] Smoke gains `/products/new`, `/products/PK-0422/edit`. `pnpm test`, `pnpm smoke`, commit `chore(example): create and edit products on their own pages`.

**Phase 2 gate.** Screenshots of the four pages, light and dark. Report and wait.

---

## Phase 3: vehicles and sites

### Task 9: Day offsets, and the vehicle schema and writes

**Files:** Create `src/lib/data/days.ts`; Modify `schemas.ts`, `fleet.ts`, `readiness.ts`; Tests `tests/days.test.ts` and the two suites

**Produces:**

```ts
// days.ts
import { CalendarDate, parseDate } from '@internationalized/date'
export const dayToDate = (offset: number): CalendarDate => parseDate(DEMO_TODAY).add({ days: offset })
export const dateToDay = (date: CalendarDate): number => date.compare(parseDate(DEMO_TODAY))

export const vehicleSchema = z.object({
  code: z.string().trim().regex(/^(VAN|TRK)-\d{3}$/, 'Like VAN-030 or TRK-216'),
  registration: z.string().trim().min(4, 'Enter the registration'),
  type: z.enum(['van', 'truck']),
  homeLocationId: z.string().min(1, 'Choose a home site'),
  driverId: z.string().nullable(),
  mileageKm: z.number().int().min(0, 'Cannot be negative'),
  nextServiceDay: z.number().int(),
  condition: z.enum(['excellent', 'good', 'service-due', 'overdue']),
})
export type VehicleInput = z.infer<typeof vehicleSchema>
createVehicle(s, raw): Vehicle          // id `veh-<code lower>`, status 'idle'
updateVehicle(s, idOrCode, raw): Vehicle
vehicleToInput(vehicle): VehicleInput
assignableDrivers(s, vehicleId: Id | null): Driver[]   // drivers with no vehicle, plus this vehicle's
vehicleReadiness(values): ReadinessItem[]               // "Code and registration", "Home site", "Next service date"
```

`dayToDate(0)` is `2026-07-14`; `dateToDay(dayToDate(-3)) === -3`. Both writes throw "{code} is already in use" for another vehicle's code. Assigning a driver: clear `vehicleId` on the driver previously on this vehicle, clear `driverId` on the vehicle the new driver had, then link both ways. `driverId: null` unlinks.

- [ ] Tests first (the day round-trip; code format and uniqueness; driver moves from TRK-212 to a new vehicle and TRK-212 ends with no driver; unassign), implement, commit `chore(example): vehicles can be created and updated, with drivers kept in step`.

### Task 10: The vehicle form and routes

- [ ] Sections: Vehicle (`Truck`: code, registration, type `Select`), Assignment (`MapPin`: home site `Select`; driver `Combobox` of `assignableDrivers` with a "No driver" item mapping to `null`), Service (`Wrench`: mileage `NumberInput` suffix km, next service `DatePicker` bound through `dayToDate`/`dateToDay`, condition `Select`). Aside Summary: code, type, home site, driver, next service as a date. Status is not on the form; on edit the summary shows it as a `Badge`.
- [ ] Routes `/fleet/new` ("New vehicle", submit "Add vehicle") and `/fleet/[id]/edit` (by code). Fleet list: "New vehicle" in the header. Vehicle detail: "Edit".
- [ ] Smoke gains `/fleet/new`, `/fleet/TRK-212/edit`. Commit `chore(example): create and edit vehicles on their own pages`.

### Task 11: The site schema and writes

**Produces:**

```ts
export const siteSchema = z.object({
  name: z.string().trim().min(2, 'Name the site'),
  city: z.string().trim().min(1, 'Enter a city'),
  manager: z.string().trim().min(1, 'Name the manager'),
  capacityUnits: z.number().int().positive('Enter the capacity'),
  docks: z.number().int().min(1, 'At least one dock'),
  zones: z.array(z.object({
    name: z.string().trim().min(1, 'Name the zone'),
    capacity: z.number().int().positive('Enter a capacity'),
  })).min(1, 'Add a zone'),
})
export type SiteInput = z.infer<typeof siteSchema>
createSite(s, raw): Location            // id `loc-<name slug>`; zones used 0
updateSite(s, id, raw): Location        // zones matched by position; a kept zone keeps its used
siteToInput(location): SiteInput
siteReadiness(values): ReadinessItem[]   // "Named", "Manager", "Capacity and docks", "At least one zone"
```

`updateSite` throws "Zone {name} holds {used}; its capacity can't go below that" when a kept zone's capacity is below its used, and "Zone {name} still holds stock" when a removed zone (beyond the new length) has `used > 0`.

- [ ] Tests first, implement, commit `chore(example): sites can be created and updated`.

### Task 12: The site form and routes

- [ ] Sections: Site (`Warehouse`: name, city, manager), Capacity (`Gauge`: capacity units, docks), Zones (`LayoutGrid`: rows of name `Input`, capacity `NumberInput`, and on edit a muted "{used} used" beside it; add and remove, at least one). Aside Summary: utilisation as `Progress` with its percent, docks, zone count.
- [ ] Routes `/warehouses/new` ("New site", submit "Add site") and `/warehouses/[id]/edit`. Warehouses list: "New site". Site detail: "Edit".
- [ ] Smoke gains `/warehouses/new`, `/warehouses/loc-riverside/edit`. Commit `chore(example): create and edit sites on their own pages`.

**Phase 3 gate.** Screenshots of the four pages, light and dark. Report and wait.

---

## Phase 4: shipments

### Task 13: The shipment schema, the run's derived parts, and writes

**Produces:**

```ts
export const shipmentSchema = z.object({
  originId: z.string().min(1, 'Choose an origin'),
  vehicleId: z.string().min(1, 'Choose a vehicle'),
  driverId: z.string().min(1, 'Choose a driver'),
  orderIds: z.array(z.string()).min(1, 'Choose at least one order'),
})
export type ShipmentInput = z.infer<typeof shipmentSchema>
isShipmentEditable(shipment): boolean                       // 'scheduled'
candidateOrders(s, originId: Id, shipmentId: Id | null): Order[]   // ready, from origin, no shipment; plus this shipment's orders
candidateVehicles(s, originId: Id, shipmentId: Id | null): Vehicle[] // idle and homed at origin; plus this shipment's
plannedStops(s, orderIds: Id[]): Stop[]   // destination per order, eta { day: 1, time } from 09:00 every 45 min, deliveredAt null
createShipment(s, raw): Shipment          // next SHP number, 'scheduled'; each order → 'in-fulfilment', shipmentId, event
updateShipment(s, idOrNumber, raw): Shipment   // refuses unless scheduled; applies the difference
shipmentToInput(shipment): ShipmentInput
shipmentReadiness(values): ReadinessItem[]      // "Origin", "Vehicle", "Driver", "At least one order"
```

Both writes refuse an order that is not a candidate ("{number} isn't ready at this origin"). On update, a removed order returns to `ready` with a `ready` event and `shipmentId: null`; stops are recomputed. Times are `'09:00'`, `'09:45'`, `'10:30'`….

- [ ] Tests first: candidates at Riverside DC are exactly the seed's ready, unshipped Riverside orders; `plannedStops` times for three orders; create moves two orders and numbers the next SHP; update unticks one (back to `ready`, event appended) and ticks another; update on a delivered shipment throws; an order from another origin is refused.
- [ ] Implement, commit `chore(example): shipments can be planned and replanned`.

### Task 14: The run planner and its routes

- [ ] `shipment-form.svelte` sections: Run (`Route`: origin `Select`; vehicle `Select` from `candidateVehicles`, which on change preselects that vehicle's driver; driver `Select` of every driver not on leave; the seed has no free on-shift driver, so a driver already paired with another vehicle may drive this run), Orders (`ListChecks`: a mise `Table` with a `Checkbox` column, order number, client, destination, weight; an `Empty` "No ready orders at {origin}" when there are none), Stops (`MapPin`: an ordered list of `plannedStops` with the ETA time, read-only). Changing the origin clears `vehicleId`, `driverId` and `orderIds`. Aside Summary: vehicle code, driver name, "{n} orders · {kg} kg", stop count.
- [ ] Routes `/shipments/new` (title "Plan a run", description "Pick a vehicle and driver, then the ready orders it carries.", submit "Schedule shipment", back to Shipments) and `/shipments/[id]/edit` (title "Edit run", refuses unless scheduled with the order page's `ErrorState` wording). Shipments list: "Plan a run" in the header. Shipment detail: "Edit" when scheduled.
- [ ] Smoke gains `/shipments/new` and `/shipments/SHP-3015/edit` (scheduled in the seed). Commit `chore(example): plan and replan shipment runs`.

**Phase 4 gate.** Screenshots of both pages, light and dark, with orders ticked (flip the initial draft for the shot, then revert). Report and wait.

---

## Phase 5: the finish

### Task 15: README, handoff and the final run

- [ ] `examples/logistics/README.md`: the screens list gains create and edit for each entity, and a line on the frame and the guard.
- [ ] `/docs/handoff.md`: the demo paragraph mentions create and edit pages; the example test count updated.
- [ ] `pnpm --filter mise-logistics-example test`, `pnpm smoke` (now 27 routes plus the not-found ones) exit 0. Commit `docs(example): create and edit pages in the README and the handoff`.

**Phase 5 gate.** Final report; push on approval and watch the Example workflow.
