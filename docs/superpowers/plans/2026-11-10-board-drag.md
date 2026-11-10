# Board dragging and the Orders board Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans, inline in the main session (the user's choice for this repo). Activate the authors-components, vitest-testing, git-workflow, documents-updates and writes-clean-code skills. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Cards on mise's `Board` can be dragged between columns, and the logistics example's Orders board shows all five statuses and every order, with a drop running the demo's real actions.

**Architecture:** Dragging lives in the Board family. A small rune-backed model, `BoardDrag`, shared through Svelte context, holds the columns, decides whether a column takes a card, reports drops through `onMove`, and runs the keyboard path and its announcements. Pointer and touch dragging come from `@dnd-kit/svelte`: `Board` hosts its `DragDropProvider` (pointer sensor only), `BoardCard` is a draggable, `BoardColumn` a droppable; both feed the same model. mise never moves a card: the app changes its data and the card renders in its new column.

**Tech Stack:** Svelte 5 (runes, `svelte/reactivity`), `@dnd-kit/svelte` 0.5.3, Tailwind v4, Vitest + Testing Library, Storybook.

**Spec:** `docs/specs/2026-11-10-board-drag-design.md`

## Global Constraints

- Component rules from the authors-components skill: header comment first (`Origin: mise`, `Diverged:`), exported `<Part>Props` with JSDoc, `ref = $bindable(null)`, `class` merged last through `cn`, `...rest` on the root, `data-slot` on every part, `.js` on relative imports.
- A board without `onMove` renders exactly as before: no drag attributes, no provider, no live region.
- Colours only from semantic tokens and `src/lib/utils/tone.ts`.
- Commits are `feat`/`fix`/`docs`, never `feat!` (the user's apps are the only consumers). Example commits are `chore(example)`.
- Commit only when `pnpm test` and `pnpm build:storybook` both exit 0, checked by exit code in the same command as the commit. Run `pnpm fix:spacing` then `pnpm format` first. The example's gate is `pnpm --filter mise-logistics-example test` and `smoke`.
- Work on branch `feat/board-drag`; it reaches `main` by a pull request after both phase gates.
- Phase gates after Task 4 and Task 7.

## Decisions taken while planning

| # | Decision | Ruling |
| --- | --- | --- |
| K1 | Keyboard | dnd-kit's `KeyboardSensor` nudges the card 10px per arrow press; it cannot step between columns. mise runs its own keyboard path on `BoardDrag`: Space or Enter picks a focused card up, Left and Right step to the previous or next column, Space or Enter drops, Escape cancels. `Board` passes `sensors={[PointerSensor]}`, so dnd-kit's keyboard sensor is off |
| K2 | Pointer activation | dnd-kit's default pointer sensor already waits for 5px of movement (or 200ms) with a mouse, and a 250ms press on touch, so a click on a card's link still opens it. No `@dnd-kit/dom` import is needed |
| K3 | Announcements | `BoardDrag` writes one polite live region (`data-slot="board-live"`, `sr-only`) for both paths, so dnd-kit's accessibility plugin is not relied on for wording |
| K4 | A card's name | `BoardCard` takes `label?: string` for announcements ("Picked up OR-2053"); without it the card's `id` is read |
| K5 | Tests | The keyboard path and the drop rules are tested in jsdom. Pointer dragging is checked in a browser through the DevTools protocol, from a script kept outside the repository (the handoff's practice) |
| K6 | Built differently | The drop ring's tone map stays in `board-column.svelte` (`DROP_RING_CLASS`) rather than a new public map in `tone.ts`: one part uses it. dnd-kit's accessibility plugin is filtered out and a link card sets `role="link"` (the plugin turned links into buttons). Each draggable passes `sensors: [PointerSensor]` itself, since it binds its sensors before the provider's apply. Space picks a card up; Enter is left to the link |

---

## Phase 1: mise

### Task 1: The peer floor and the drag model

**Files:**
- Modify: `package.json` (`peerDependencies.svelte` from `^5.0.0` to `^5.29.0`)
- Create: `src/lib/components/data-display/board/board-drag.svelte.ts`
- Test: `tests/board-drag.test.ts`

**Interfaces:**
- Produces: `BoardMove = { id: string; from: string; to: string }`; `BoardCardRef = { id: string; from: string }`; `BoardAccepts = (card: BoardCardRef) => boolean`; class `BoardDrag` with `register(id: string, column: { title: string; accepts?: BoardAccepts }): () => void`, `canDrop(card: BoardCardRef, to: string): boolean`, `drop(card: BoardCardRef, to: string, label: string): boolean`, `pickUp(card: BoardCardRef, label: string)`, `step(direction: -1 | 1)`, `commit()`, `cancel()`, and reactive `held: BoardCardRef | null`, `over: string | null`, `message: string`; `setBoardDrag(drag)`, `getBoardDrag(): BoardDrag | undefined`.

- [ ] **Step 1: The failing test**

```ts
import { describe, expect, it, vi } from 'vitest'

import { BoardDrag } from '../src/lib/components/data-display/board/board-drag.svelte.js'

function board() {
  const onMove = vi.fn()
  const drag = new BoardDrag(onMove)

  drag.register('received', { title: 'Received', accepts: () => false })
  drag.register('ready', { title: 'Ready', accepts: (card) => card.from === 'received' })
  drag.register('cancelled', { title: 'Cancelled' })

  return { drag, onMove }
}

const card = { id: 'or-2060', from: 'received' }

describe('BoardDrag', () => {
  it('reports an accepted drop, and nothing else', () => {
    const { drag, onMove } = board()

    expect(drag.drop(card, 'ready', 'OR-2060')).toBe(true)
    expect(onMove).toHaveBeenCalledWith({ id: 'or-2060', from: 'received', to: 'ready' })
  })

  it('refuses a drop on the card’s own column or a column that does not accept it', () => {
    const { drag, onMove } = board()

    expect(drag.drop(card, 'received', 'OR-2060')).toBe(false)
    expect(drag.drop({ id: 'or-2053', from: 'ready' }, 'received', 'OR-2053')).toBe(false)
    expect(drag.message).toBe('Received does not accept OR-2053')
    expect(onMove).not.toHaveBeenCalled()
  })

  it('accepts a card from another column when the column gives no rule', () => {
    expect(board().drag.canDrop({ id: 'or-2053', from: 'ready' }, 'cancelled')).toBe(true)
  })

  it('steps a held card between columns and drops it, announcing each step', () => {
    const { drag, onMove } = board()

    drag.pickUp(card, 'OR-2060')

    expect(drag.message).toBe('Picked up OR-2060. Left and Right move it, Space drops it, Escape cancels.')

    drag.step(1)

    expect(drag.over).toBe('ready')
    expect(drag.message).toBe('Over Ready')

    drag.commit()

    expect(onMove).toHaveBeenCalledWith({ id: 'or-2060', from: 'received', to: 'ready' })
    expect(drag.held).toBeNull()
    expect(drag.message).toBe('Dropped OR-2060 in Ready')
  })

  it('stops at the ends, and cancels without moving', () => {
    const { drag, onMove } = board()

    drag.pickUp(card, 'OR-2060')
    drag.step(-1)

    expect(drag.over).toBe('received')

    drag.cancel()

    expect(drag.held).toBeNull()
    expect(drag.message).toBe('Cancelled. OR-2060 stays in Received')
    expect(onMove).not.toHaveBeenCalled()
  })

  it('forgets a column once it unregisters', () => {
    const { drag } = board()
    const unregister = drag.register('done', { title: 'Done' })

    unregister()

    expect(drag.canDrop(card, 'done')).toBe(false)
  })
})
```

- [ ] **Step 2:** `pnpm exec vitest run tests/board-drag.test.ts`: fails, the module does not exist.

- [ ] **Step 3: The model**

```ts
/**
 * Origin: mise
 * Diverged: none. What a Board knows while a card is dragged: its columns in
 *   order, whether a column takes a card, and the keyboard path. The pointer
 *   path (dnd-kit) and the keyboard path both drop through `drop`, so one rule
 *   decides and one live region speaks (2026-11-10).
 */
import { getContext, setContext } from 'svelte'
import { SvelteMap } from 'svelte/reactivity'

/** A drop the app is asked to make: card `id` from column `from` to column `to`. */
export type BoardMove = { id: string; from: string; to: string }

/** A card being dragged, and the column it sits in. */
export type BoardCardRef = { id: string; from: string }

/** Whether a column takes a card. By default, any card from another column. */
export type BoardAccepts = (card: BoardCardRef) => boolean

type Column = { title: string; accepts?: BoardAccepts }

const KEY = Symbol('board-drag')

export class BoardDrag {
  readonly #onMove: (move: BoardMove) => void
  readonly #columns = new SvelteMap<string, Column>()

  held = $state<BoardCardRef | null>(null)
  over = $state<string | null>(null)
  message = $state('')

  #heldLabel = ''

  constructor(onMove: (move: BoardMove) => void) {
    this.#onMove = onMove
  }

  /** Columns register as they mount, so the map keeps their order on the page. */
  register(id: string, column: Column): () => void {
    this.#columns.set(id, column)

    return () => this.#columns.delete(id)
  }

  #title(id: string): string {
    return this.#columns.get(id)?.title ?? id
  }

  canDrop(card: BoardCardRef, to: string): boolean {
    const column = this.#columns.get(to)

    if (!column || to === card.from) {
      return false
    }

    return column.accepts?.(card) ?? true
  }

  drop(card: BoardCardRef, to: string, label: string): boolean {
    if (to === card.from) {
      return false
    }

    if (!this.canDrop(card, to)) {
      this.message = `${this.#title(to)} does not accept ${label}`

      return false
    }

    this.#onMove({ id: card.id, from: card.from, to })

    this.message = `Dropped ${label} in ${this.#title(to)}`

    return true
  }

  pickUp(card: BoardCardRef, label: string) {
    this.held = card
    this.over = card.from
    this.#heldLabel = label
    this.message = `Picked up ${label}. Left and Right move it, Space drops it, Escape cancels.`
  }

  step(direction: -1 | 1) {
    if (!this.held || !this.over) {
      return
    }

    const order = [...this.#columns.keys()]
    const next = order[order.indexOf(this.over) + direction]

    if (!next) {
      return
    }

    this.over = next
    this.message = this.canDrop(this.held, next)
      ? `Over ${this.#title(next)}`
      : `Over ${this.#title(next)}, which does not accept ${this.#heldLabel}`
  }

  commit() {
    if (!this.held || !this.over) {
      return
    }

    const card = this.held
    const to = this.over

    this.held = null
    this.over = null

    if (to === card.from) {
      this.message = `Dropped ${this.#heldLabel} back in ${this.#title(to)}`

      return
    }

    this.drop(card, to, this.#heldLabel)
  }

  cancel() {
    if (!this.held) {
      return
    }

    this.message = `Cancelled. ${this.#heldLabel} stays in ${this.#title(this.held.from)}`
    this.held = null
    this.over = null
  }
}

export function setBoardDrag(drag: BoardDrag) {
  setContext(KEY, drag)
}

/** The board's drag model, or nothing on a board without `onMove`. */
export function getBoardDrag(): BoardDrag | undefined {
  return getContext<BoardDrag | undefined>(KEY)
}
```

- [ ] **Step 4:** Run: passes. Raise the peer floor in `package.json`. No commit yet: the model lands with the parts (Task 3).

### Task 2: Columns and cards join the model

**Files:**
- Modify: `src/lib/components/data-display/board/{board.svelte,board-column.svelte,board-card.svelte,index.ts}`
- Create: `tests/fixtures/board-drag-harness.svelte`
- Test: `tests/board.test.ts` (additions)

**Interfaces:**
- Consumes: Task 1.
- Produces: `BoardProps` gains `onMove?: (move: BoardMove) => void`; `BoardColumnProps` gains `id?: string`, `accepts?: BoardAccepts`; `BoardCardProps` gains `id?: string`, `label?: string`. A column renders `data-drop="accepts" | "refuses"` while a card is held over the board, and a held card `data-held`. The barrel exports the types `BoardMove`, `BoardCardRef`, `BoardAccepts`.

- [ ] **Step 1: The harness**: a `Board` with `onMove` pushing into a bound `moves` array (printed in `<output data-testid="moves">` as `JSON.stringify`), three columns `received` (accepts nothing), `ready` (accepts from `received`), `cancelled` (default), cards `or-2060` (label `OR-2060`) in `received` and `or-2053` in `ready`, each with `href`; and a `readonly` prop that leaves `onMove` out.

- [ ] **Step 2: Failing tests**, added to `tests/board.test.ts`:

```ts
describe('Board dragging', () => {
  it('adds nothing to a board without onMove', () => {
    const { container } = render(BoardDragHarness, { readonly: true })

    expect(container.querySelector('[data-slot="board-live"]')).toBeNull()
    expect(container.querySelector('[data-slot="board-card"]')).not.toHaveAttribute('aria-roledescription')
  })

  it('marks cards draggable and tells a screen reader how', () => {
    render(BoardDragHarness)

    const card = screen.getByRole('link', { name: /OR-2060/ })

    expect(card).toHaveAttribute('aria-roledescription', 'draggable card')
    expect(card).toHaveAttribute('aria-describedby')
  })

  it('moves a card with the keyboard and reports the move', async () => {
    render(BoardDragHarness)

    screen.getByRole('link', { name: /OR-2060/ }).focus()

    await userEvent.keyboard(' ')

    expect(screen.getByRole('link', { name: /OR-2060/ })).toHaveAttribute('data-held')

    await userEvent.keyboard('{ArrowRight} ')

    expect(screen.getByTestId('moves')).toHaveTextContent(
      JSON.stringify([{ id: 'or-2060', from: 'received', to: 'ready' }]),
    )
  })

  it('shows which columns take the held card, and refuses the rest', async () => {
    const { container } = render(BoardDragHarness)

    screen.getByRole('link', { name: /OR-2053/ }).focus()

    await userEvent.keyboard(' ')

    const columns = [...container.querySelectorAll('[data-slot="board-column"]')]

    expect(columns.map((column) => column.getAttribute('data-drop'))).toEqual([
      'refuses',
      null,
      'accepts',
    ])

    await userEvent.keyboard('{ArrowLeft} ')

    expect(screen.getByTestId('moves')).toHaveTextContent('[]')
    expect(container.querySelector('[data-slot="board-live"]')).toHaveTextContent(
      'Received does not accept OR-2053',
    )
  })

  it('cancels on Escape', async () => {
    render(BoardDragHarness)

    screen.getByRole('link', { name: /OR-2060/ }).focus()

    await userEvent.keyboard(' {ArrowRight}{Escape}')

    expect(screen.getByTestId('moves')).toHaveTextContent('[]')
  })
})
```

`null` for the held card's own column: it neither accepts nor refuses.

- [ ] **Step 3:** Run: fails.
- [ ] **Step 4: The parts**
  - `board.svelte`: with `onMove`, creates `const drag = new BoardDrag((move) => onMove?.(move))`, calls `setBoardDrag(drag)`, renders the row inside `<DragDropProvider sensors={[PointerSensor]} onDragEnd={...}>` (both from `@dnd-kit/svelte`), and after the row a `<p data-slot="board-live" class="sr-only" aria-live="polite">{drag.message}</p>` and a hidden `<p id={instructionsId} class="sr-only">Press Space to pick a card up, Left and Right to move it, Space to drop it.</p>` whose id it shares through the model (add `instructionsId` to `BoardDrag` as a constructor argument). `onDragEnd(event)`: if `event.canceled` or no `event.operation.target`, return; else `drag.drop({ id: String(source.id), from: String(source.data.from) }, String(target.id), String(source.data.label))`. Without `onMove`, the row renders as now.
  - `board-column.svelte`: `const drag = getBoardDrag()`; when `drag && id`: `$effect(() => drag.register(id, { title: typeof title === 'string' ? title : id, accepts }))`, a dnd-kit droppable `createDroppable({ id, accept: (source) => drag.canDrop({ id: String(source.id), from: String(source.data.from) }, id) })` attached to the section with `{@attach droppable.attach}`; `data-drop` is `undefined` with no held card or over this column's own card, else `'accepts'`/`'refuses'` from `drag.canDrop`. The held card is `drag.held` (keyboard) or the dnd-kit source while `droppable.isDropTarget` or any drag is under way (read the manager's `dragOperation.source` through `getDragDropManager()`).
  - `board-card.svelte`: takes `id` and `label`; reads its column's id from a column context (`setContext` in BoardColumn, a plain `{ id }` object); when `drag && id && column`: `createDraggable({ id, data: { from: column.id, label: label ?? id } })` attached with `{@attach draggable.attach}`, `aria-roledescription="draggable card"`, `aria-describedby={drag.instructionsId}`, `data-held` while `drag.held?.id === id` or `draggable.isDragSource`, and an `onkeydown`: Space or Enter while nothing is held, `preventDefault()` and `drag.pickUp`; while this card is held, ArrowLeft/ArrowRight `drag.step`, Space/Enter `drag.commit()`, Escape `drag.cancel()`, each with `preventDefault()`. A caller's `onkeydown` runs first.
- [ ] **Step 5:** Run `tests/board.test.ts`, `tests/board-drag.test.ts`, `tests/barrel.test.ts`; `pnpm check`. If `createDraggable` or `createDroppable` throws in jsdom, guard them behind `typeof window.PointerEvent !== 'undefined'` and note it on the module's `Diverged:` line.

### Task 3: How a drag looks, and long columns

**Files:**
- Modify: `board.svelte`, `board-column.svelte`, `board-card.svelte`
- Test: `tests/board.test.ts`

- [ ] **Step 1: Failing tests**: the cards list carries `overflow-y-auto` and `min-h-0`, and the column `max-h-full`; a column with `data-drop="accepts"` carries the ring classes for its tone; a held card carries `opacity-50`.
- [ ] **Step 2: Classes**
  - Column: `flex min-h-0 max-h-full flex-col` on the section; the cards `div` becomes `min-h-0 flex-1 overflow-y-auto` with `-mx-1 px-1 pb-1` so card shadows and focus rings are not clipped. The header stays outside it, so it stays put while the list scrolls.
  - `data-[drop=accepts]:ring-2` with the tone's ring colour: add `TONE_RING_CLASS` to `src/lib/utils/tone.ts` if it does not exist (`ring-primary/40`, `ring-info/40`, `ring-success/40`, `ring-warning/40`, `ring-critical/40`, neutral `ring-foreground/20`), with its test in `tests/tone.test.ts` beside the other maps; `data-[drop=refuses]:opacity-50 data-[drop=refuses]:cursor-not-allowed`.
  - Card: `data-[held]:opacity-50`, `cursor-grab` with a board `onMove`, `active:cursor-grabbing`, `touch-manipulation`.
  - `Board`: renders `<DragOverlay>` from `@dnd-kit/svelte` whose snippet repeats the dragged card's markup: keep each card's content snippet in the model while it is dragged (`drag.overlay = children`), and render it in a `bg-card rounded-lg border p-3 text-sm shadow-lg rotate-1` shell.
- [ ] **Step 3:** Run the tests; `pnpm check`.

### Task 4: Story, browser check, commit

**Files:**
- Modify: `src/lib/components/data-display/board/board.stories.svelte`, the three parts' headers, `skills/mise/SKILL.md`, `docs/handoff.md`

- [ ] **Step 1: Story** "With dragging" (asChild), after the existing `With …` stories: module-level `$state` holding three columns of cards (Received, Packed, Shipped; Shipped accepts only from Packed), `onMove` moving the card between the arrays, columns at `max-h-80` so one scrolls.
- [ ] **Step 2: Headers.** `Diverged:` on Board, BoardColumn and BoardCard: "Cards can be dragged between columns when the board has `onMove` (2026-11-10): pointer and touch through `@dnd-kit/svelte`, the keyboard through mise's own path; mise reports a drop and the app moves the card."
- [ ] **Step 3: Skill and handoff.** `skills/mise/SKILL.md`, under Board's line: "cards dragged between columns: `onMove` on `Board`, `id` on columns and cards, `accepts` on a column; move the card in your data". `pnpm build:skill`. Handoff: the deferred list says Board now drags; generic Draggable, Droppable and Sortable stay deferred; the Svelte peer is `^5.29.0`.
- [ ] **Step 4: Browser check.** Storybook static build on 6016. A script outside the repository (`/tmp/board-drag-check/check.mjs`) drives the headless shell through the DevTools protocol: `Input.dispatchMouseEvent` pressed at a Received card's centre, moved in 10 steps to the Packed column's centre, released; screenshot; then the same into Shipped from Received (refused) and a screenshot mid-drag showing the refused column faded. Expect the card in Packed after the first drop and still in Received after the second.
- [ ] **Step 5:** Screenshots of "With dragging" in both schemes, at rest and mid-drag. Gate and commit `feat(board): drag cards between columns` (model, parts, tone map, story, skill, handoff, `package.json`).
- [ ] **Step 6: Phase gate.**

## Phase 2: the Orders board

### Task 5: The data

**Files:**
- Modify: `examples/logistics/src/modules/orders/data/index.ts`, `examples/logistics/src/modules/shipments/data/index.ts`, every importer of `OPEN_STATUSES` (`routes/orders/+page.svelte`, `modules/orders/components/orders-board.svelte`)
- Test: `examples/logistics/tests/orders.test.ts`, `examples/logistics/tests/shipments.test.ts`

**Interfaces:**
- Produces: `FLOW_STATUSES` (the four, for the stat tiles), `BOARD_STATUSES` (all five); `markReady(source, idOrNumber): Order`; `addOrderToShipment(source, shipmentIdOrNumber, orderIdOrNumber): Shipment`; `cancelOrder` takes an in-fulfilment order off its run; `runsFor(source, order): Shipment[]` (scheduled runs at the order's origin).

- [ ] **Step 1: Failing tests**

```ts
// orders.test.ts
it('marks a received order ready, and only a received one', () => {
  const received = listOrders(source, { status: 'received' })[0]
  const ready = markReady(source, received.number)

  expect(ready.status).toBe('ready')
  expect(ready.events.at(-1)?.status).toBe('ready')
  expect(() => markReady(source, received.number)).toThrow(/is ready and cannot be marked ready/)
})

it('cancels an order in fulfilment off its scheduled run', () => {
  const run = source.data.shipments.find((shipment) => shipment.status === 'scheduled')

  if (!run) throw new Error('The seed has no scheduled run')

  const [orderId] = run.orderIds
  const order = cancelOrder(source, orderId)

  expect(order.status).toBe('cancelled')
  expect(order.shipmentId).toBeNull()
  expect(getShipment(source, run.number)?.orderIds).not.toContain(orderId)
})

it('refuses to cancel an order whose run has left', () => {
  const run = source.data.shipments.find((shipment) => shipment.status === 'in-transit')

  if (!run) throw new Error('The seed has no run in transit')

  const order = seedOrder(getOrderNumber(run.orderIds[0]))

  expect(() => cancelOrder(source, order.number)).toThrow(
    `${order.number} is on ${run.number}, which is in transit`,
  )
})

// shipments.test.ts
it('puts a ready order on a scheduled run from its origin, and replans the stops', () => {
  const run = source.data.shipments.find((shipment) => shipment.status === 'scheduled')

  if (!run) throw new Error('The seed has no scheduled run')

  const order = candidateOrders(source, run.originId, run.id).find((candidate) => candidate.shipmentId === null)

  if (!order) throw new Error('No ready order at the run’s origin')

  const updated = addOrderToShipment(source, run.number, order.number)

  expect(updated.orderIds).toContain(order.id)
  expect(updated.stops).toHaveLength(updated.orderIds.length)
  expect(getOrder(source, order.number)?.status).toBe('in-fulfilment')
  expect(runsFor(source, order)).toEqual([])
})
```

`getOrderNumber` is a two-line helper in the test: the order's `number` from its id. If the seed has no scheduled run with orders, or no in-transit run, the tests say so by throwing, and the seed is checked before anything is changed; the seed must not change (`SEED_VERSION` stays).

- [ ] **Step 2:** Run: fails.
- [ ] **Step 3: Implementation.** `markReady` throws `` `${number} is ${status} and cannot be marked ready` `` unless `received`; sets `ready`, pushes `{ status: 'ready', at: { day: 0, time: '12:00' } }`. `runsFor` filters `listShipments` to `scheduled` runs whose `originId` is the order's. `addOrderToShipment` finds both, throws unless the order is `ready` with no `shipmentId` and the run is in `runsFor`, then calls `updateShipment(source, run.id, { ...shipmentToInput(run), orderIds: [...run.orderIds, order.id] })`. `cancelOrder`: when `order.shipmentId`, find the run; if it is not `scheduled`, throw `` `${order.number} is on ${run.number}, which is ${run.status.replaceAll('-', ' ')}` ``; else `updateShipment` without the order (which sends it back to ready), then cancel as now. Rename `OPEN_STATUSES` to `FLOW_STATUSES` at every importer and add `BOARD_STATUSES = [...FLOW_STATUSES, 'cancelled'] as const`.
- [ ] **Step 4:** Run the example's tests; commit `chore(example): mark ready, put on a run, and cancel off a run`.

### Task 6: The board

**Files:**
- Modify: `examples/logistics/src/modules/orders/components/orders-board.svelte`, `examples/logistics/src/routes/orders/+page.svelte`
- Create: `examples/logistics/src/modules/orders/components/put-on-run-dialog.svelte`

- [ ] **Step 1: The board.** `BOARD_STATUSES` columns, `id={status}`, `accepts` from a lookup map:

```ts
const ACCEPTS: Record<OrderStatus, (card: BoardCardRef) => boolean> = {
  received: () => false,
  ready: (card) => card.from === 'received',
  'in-fulfilment': (card) => card.from === 'ready',
  completed: () => false,
  cancelled: (card) => card.from !== 'completed',
}
```

Every order in a column (no `slice`); cards `id={order.id}` `label={order.number}`; columns `class="max-h-[calc(100svh-22rem)]"` (tuned against the smoke screenshot so a column ends above the fold). `Board onMove` calls the component's `onmove` prop.
- [ ] **Step 2: The page.** `onmove({ id, to })` on `/orders`: `to === 'ready'`: `markReady`, `toast.success(`${number} is ready`)`; `to === 'in-fulfilment'`: open the put-on-run dialog for that order; `to === 'cancelled'`: set the existing `cancelling` state, which opens the existing confirm dialog. Each store call in `try`; a throw becomes `toast.error(error.message)`. The confirm path's existing `cancelOrder` call gets the same `try`.
- [ ] **Step 3: The dialog.** `put-on-run-dialog.svelte`: `Dialog` titled "Put {number} on a run", a `Select` (type single, `items` from `runsFor`, label "SHP-3015 · {vehicle} · leaves {date}"), Confirm calls `addOrderToShipment` then `toast.success(`${number} is on ${run.number}`)`. With no runs, a sentence "No scheduled run leaves from {origin}." and a `Button href={resolve('/shipments/new')}` "Plan a run". Closing does nothing to the order.
- [ ] **Step 4:** `pnpm build`, the example's tests; commit `chore(example): the orders board has five columns and takes drops`.

### Task 7: Check it, record it

- [ ] **Step 1:** `smoke`: the board route (`orders-view-board`) in both schemes shows five columns, scrolling columns, counts matching cards.
- [ ] **Step 2:** Browser drag check on the built example (the same DevTools-protocol script, pointed at `/orders?view=board`): Received to Ready (card moves, toast); Ready to In fulfilment (the dialog opens); Ready to Received (refused, card stays). Screenshots of each.
- [ ] **Step 3:** Example README: the Orders board's moves. Handoff: the board's rules, the stricter cancel, and that completing orders waits for a run delivery action. Commit `docs: the orders board's moves in the README and the handoff`.
- [ ] **Step 4: Phase gate.** On a go, push and open the pull request into `main`; watch CI.
