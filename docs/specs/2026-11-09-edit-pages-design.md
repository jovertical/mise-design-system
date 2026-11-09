# Create and edit pages in the logistics example

**Date:** 2026-11-09
**Status:** approved in conversation (routes, page anatomy, data, per-entity forms, phases);
wireframes reviewed in the browser the same day (`.superpowers/brainstorm/`, git-ignored)
**Scope:** `examples/logistics/` only. mise changes only if a gap turns up (rule E6 of the
logistics spec), each under its own plan.

## Goal

Every entity in the demo gets a create page and an edit page in the client portal's shape, so
the demo shows how a mise app writes data as well as how it reads it. The six entities are
orders, shipments, vehicles, products, clients and sites (warehouses).

## Reference

The client portal's create and edit pages (`veritypos-client-portal`,
`src/routes/_private/suppliers/create.tsx`, `suppliers/$id/edit.tsx`,
`suppliers/-components/supplier-form.tsx`): a page header with a back link, Cancel and Save in
the header's actions, the form in a two-thirds card split into sections with icon titles, and an
aside with a live summary and a readiness card. Edit and create share one form, and leaving a
dirty form asks first.

## Decisions

| # | Decision | Ruling |
| --- | --- | --- |
| P1 | Scope | Create and edit pages for all six entities, on one shared form per entity |
| P2 | Replaced | The Create order sheet, the Add client dialog and the product row's edit dialog go; their buttons link to the new pages |
| P3 | Layout | The portal's shape: `PageHeader` with `backLink`, a `lg:grid-cols-3` grid, the form card at `lg:col-span-2`, the aside beside it, stacked below `lg` |
| P4 | Form state | superforms in SPA mode (`dataType: 'json'`, zod 4 adapter) with `mise/form`'s `FormField`, `FormControl` and `FormFieldErrors`, as the settings page does. Chosen over plain `$state` drafts (revised 2026-11-09): superforms already tracks tainted fields, nested array errors and the leave guard, and the demo should exercise `mise/form`. The Inertia-style plain form leaves the demo with the old order sheet |
| P5 | Dirty guard | superforms' `taintedMessage` as an async function that opens a "Discard changes?" `AlertDialog` and resolves with the choice; superforms handles closing the tab. A successful save resets the form to the saved values, so the navigation that follows is not challenged |
| P6 | After save | A toast, then the record's detail page |
| P7 | Not editable | Completed and cancelled orders; shipments that are not `scheduled`. The detail page hides Edit; the edit route renders `ErrorState` with a link back |
| P8 | Shipments | A run planner: origin, then an idle vehicle at that origin and a driver, then ready orders from that origin. Stops are derived |
| P9 | Data | One zod schema per entity used by create and update; `create<Entity>` and `update<Entity>` write functions parse with it. The seed does not change, so `SEED_VERSION` stays |
| P10 | Gaps | None expected. A gap stops the phase and goes into mise first |

## Routes

| Entity | Create | Edit | Detail (existing) |
| --- | --- | --- | --- |
| Orders | `/orders/new` | `/orders/[id]/edit` | `/orders/[id]` |
| Shipments | `/shipments/new` | `/shipments/[id]/edit` | `/shipments/[id]` |
| Vehicles | `/fleet/new` | `/fleet/[id]/edit` | `/fleet/[id]` |
| Products | `/products/new` | `/products/[id]/edit` | `/products/[id]` |
| Clients | `/clients/new` | `/clients/[id]/edit` | `/clients/[id]` |
| Sites | `/warehouses/new` | `/warehouses/[id]/edit` | `/warehouses/[id]` |

`[id]` takes what the detail route takes today (an order or shipment number, a vehicle code, a
SKU, a client or site id). The breadcrumb in the top bar shows the record and "Edit" or "New".

## Page anatomy

```
← Back to OR-2058                                   [Cancel] [Save changes]
Edit order
Change the client, route, packages or total.

┌──────────────── Card (lg:col-span-2) ────────┐  ┌── AsideCard: Summary ──┐
│ CardTitle icon iconTone=primary: Section     │  │ FactList of the draft  │
│ muted line                                   │  └────────────────────────┘
│ FieldGroup grid                              │  ┌── AsideCard: Ready ────┐
│ ── Separator ──                              │  │ ReadinessSummary       │
│ next section…                                │  │ ReadinessChecklist     │
└──────────────────────────────────────────────┘  └────────────────────────┘
```

- The title says what is happening: "New order", "Edit order". The description is one line.
- Save is a `type="submit"` button in the header, tied to the form by `form="<entity>-form"`.
  Its label is "Create order" / "Save changes" (shipments: "Schedule shipment").
- Field errors show on submit, from the schema, through `FormFieldErrors`; superforms focuses
  the first invalid field.
- The summary and the readiness card read the live draft. Readiness rows are the schema's
  required facts, worded as outcomes ("Client chosen").

### Shared pieces in `src/lib/components/`

- `form-page.svelte`: the page frame. Takes the title, description, back link, submit label,
  form id, and the `form` and `aside` snippets; draws the header, the grid and the
  unsaved-changes dialog. It is the example's composition of mise parts, as the portal's pages
  are; it is not a look-alike of a mise component.
- `unsaved-changes-dialog.svelte`: the `AlertDialog` the guard opens ("Keep editing" /
  "Discard").
- `src/lib/entity-form.svelte.ts`: `entityForm(schema, initial, onsave)`, one superForm set up
  the same way for every page (SPA, json, validators, the guard, reset on save).
- `line-items.svelte` is not built: each line-item list is a few rows of mise inputs inside its
  form, as in the portal.

## Entities

### Orders (`order-form.svelte`, rewritten)

| Section | Fields |
| --- | --- |
| Client and service | client `Combobox` (active clients), service `Select` |
| Route | ships from `Select`, delivery address `Input` |
| Packages | rows of contents `Input` and weight `NumberInput` (kg), labels `PKG-1…` numbered by position; add and remove; at least one |
| Billing | total `NumberInput` currency |

Summary: client, service, route, package count and total weight, total. Readiness: client
chosen; origin and delivery address; at least one package with a weight; total set. Editable
while `received` or `ready`; status is never edited here. Create keeps today's defaults
(`manual` source, `received`, an event).

### Clients (`client-form.svelte`)

| Section | Fields |
| --- | --- |
| Company | name, industry, city |
| Contact | contact name, email |
| Account | manager `Input`, active `SwitchField` (active / paused) |

Summary: name, industry, contact; on edit also lifetime value and open-order value, read-only.
Readiness: named; contact and email; city.

### Products (`product-form.svelte`)

| Section | Fields |
| --- | --- |
| Product | name, SKU (capitals, digits and dashes; unique), category `Select`, unit |
| Pricing | price `NumberInput` currency, reorder point |
| Stock by site | create: opening on-hand per site (`NumberInput`, 0 by default); edit: the same rows read-only, with reserved |

Summary: price, total on hand against the reorder point, a low-stock `Badge` when under it.
Readiness: named; SKU; price; reorder point.

### Vehicles (`vehicle-form.svelte`)

| Section | Fields |
| --- | --- |
| Vehicle | code (unique), registration, type `Select` (van, truck) |
| Assignment | home site `Select`, driver `Combobox` of unassigned drivers plus the current one, or none |
| Service | mileage `NumberInput` km, next service `DatePicker` (stored as a day offset from `DEMO_TODAY`), condition `Select` |

Status is operational and not edited; a new vehicle is `idle`. Assigning a driver sets
`vehicle.driverId` and `driver.vehicleId` and clears the driver's previous vehicle.

### Sites (`site-form.svelte`)

| Section | Fields |
| --- | --- |
| Site | name, city, manager |
| Capacity | capacity units, docks |
| Zones | rows of name and capacity; used shown read-only on edit (0 on create); capacity may not go below used; at least one |

Summary: utilisation (used over capacity across zones), docks, zone count.

### Shipments (`shipment-form.svelte`)

| Section | Fields |
| --- | --- |
| Run | origin `Select`; vehicle `Select` of idle vehicles whose home is the origin (plus the current one on edit); driver `Select` (the vehicle's driver preselected) |
| Orders | a table with a `Checkbox` per row: `ready` orders from the origin with no shipment; on edit also the shipment's own orders |
| Stops | derived, read-only: one per ticked order's destination, in tick order; ETAs day +1 from 09:00, every 45 minutes |

Saving a new run creates a `scheduled` shipment, sets `shipmentId` on each order and moves it to
`in-fulfilment` with an event. Editing applies the difference: a newly ticked order moves as
above; an unticked one returns to `ready` with an event and `shipmentId: null`. Changing the
origin clears the ticks. Summary: vehicle, driver, order count, total weight, stop count.
Readiness: origin; vehicle; driver; at least one order.

## Data

`src/lib/data/schemas.ts`: `orderSchema` (replaces `newOrderSchema`, with `packages` as an
array), `clientSchema` (replaces `newClientSchema`), `productSchema` (replaces
`productPatchSchema`), `vehicleSchema`, `siteSchema`, `shipmentSchema`. Each entity file gains
`create<Entity>(s, raw)` and `update<Entity>(s, id, raw)`, which parse, check what a schema
cannot (a unique SKU or code; zone capacity at least used; an order or shipment in an editable
state), and throw with a sentence a toast can show. Pages call them and never write to
`store.data` directly.

## Testing

- `tests/schemas.test.ts` and `tests/repositories.test.ts` gain cases for every new schema and
  write function, including the refusals (P7, uniqueness, zone capacity) and the shipment
  difference (tick, untick, origin change).
- `scripts/routes.ts` gains the twelve routes; the smoke run renders each in light and dark.
  `NOT_FOUND_ROUTES` gains `/orders/does-not-exist/edit`.
- Screenshots of each new page in both schemes at every phase gate.

## Phases

1. Foundation and orders: `form-page.svelte`, `unsaved-changes-dialog.svelte`, the order schema
   and writes, the order form and its two routes, the sheet removed.
2. Clients and products, with their dialogs removed.
3. Vehicles and sites.
4. Shipments: the run planner.
5. Wrap-up: the smoke list, the example's README, the handoff.

## Out of scope

Deleting records; editing an order's or a shipment's status; stock adjustments; drivers as an
entity with pages of their own; drag-to-reorder stops.
