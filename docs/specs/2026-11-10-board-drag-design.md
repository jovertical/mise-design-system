# Dragging cards on the Board, and the Orders board's five columns

**Date:** 2026-11-10
**Status:** approved in conversation (drop rules, moves, column overflow, library, mise API, demo behaviour)
**Scope:** mise's `Board` family gains dragging; the logistics example's Orders board uses it and shows all five statuses.

## Goal

The Orders board shows every status, every order, and lets a card be dragged to the next step of its flow, where a drop runs the same action the rest of the demo uses. Moving cards is the deferred drag-and-drop work (handoff, open item "deferred components"), built only as far as the board needs.

## Findings that started it

- The board loops over `OPEN_STATUSES = ['received', 'ready', 'in-fulfilment', 'completed']`, so cancelled orders never show; the name is wrong too, since `completed` is not open.
- Each column renders `slice(0, 12)` while its count says the full number: Ready hid two orders.
- No action marks an order ready. An order reaches `in-fulfilment` only by being put on a shipment run (`createShipment` / `updateShipment` set `shipmentId`). Nothing completes an order.
- `cancelOrder` cancels an in-fulfilment order but leaves it on its run's `orderIds`.

## Decisions

| # | Decision | Ruling |
| --- | --- | --- |
| D1 | What a drop means | Only real moves: each accepted drop runs an action that exists in the data; any other drop is refused |
| D2 | Which moves | Forward only, plus cancel: Received to Ready, Ready to In fulfilment, and any open order (Received, Ready, In fulfilment) to Cancelled. In fulfilment to Completed is refused: delivery belongs to the run, and completing a run's orders is shipment work, not board work. Completed and Cancelled cards cannot be dragged out |
| D3 | Overflow | Every card shows; each column scrolls inside itself with its header pinned; the count matches what is there. Dragging near a column's edge scrolls it |
| D4 | Library | `@dnd-kit/svelte` (the official Svelte 5 adapter of dnd-kit, 0.5.x): pointer, touch and keyboard sensors, auto-scroll, screen reader announcements. A regular dependency of mise, installed by the user. It needs Svelte `^5.29.0`, so mise's `svelte` peer rises from `^5.0.0` to `^5.29.0`. Rejected: `svelte-dnd-action` (moves list items itself during a drag, against D6, and refusing a drop is awkward) and native HTML5 drag and drop (no touch, no keyboard) |
| D5 | Scope in mise | Dragging is built into the Board family. No generic Draggable, Droppable or Sortable parts yet; they can be drawn out later. No reordering within a column |
| D6 | Who moves the card | mise never moves a card. `Board` reports a drop through `onMove`; the app changes its data, and the card renders in its new column. A refused move, or one the app asks about first, leaves the card where it was |
| D7 | Release | `feat`, a minor release (the user's own apps are the only consumers) |

## mise: the Board API

```svelte
<Board onMove={({ id, from, to }) => …}>
  <BoardColumn id="ready" title="Ready" tone="success" count={14}
               accepts={(card) => card.from === 'received'}>
    <BoardCard id="or-2053" href="/orders/OR-2053">…</BoardCard>
  </BoardColumn>
</Board>
```

- **Opt-in.** Without `onMove` the board is read-only and renders as it does today; existing stories and uses are unchanged.
- **`Board`**: `onMove?: (move: BoardMove) => void`, with `BoardMove = { id: string; from: string; to: string }`. It hosts the dnd-kit provider and the screen reader announcements.
- **`BoardCard`**: `id?: string`. With an `id` inside a board with `onMove`, the card is draggable. It stays a link when it has `href`: a click opens it, and a drag starts only after the pointer moves 5px.
- **`BoardColumn`**: `id?: string`, needed for a column to take drops; `accepts?: (card: { id: string; from: string }) => boolean`, by default any card from another column. A drop on the card's own column, or on a column that refuses, does not call `onMove`.
- **While dragging:** an overlay copy of the card follows the pointer and its slot shows faded; a column that accepts the card shows a ring in its tone; one that refuses fades and shows `cursor-not-allowed`.
- **Keyboard:** a focused card picks up on Space, moves between columns with Left and Right, drops on Space, cancels on Escape. Announcements: "Picked up OR-2053", "Over Ready", "Dropped in Ready", "Ready does not accept OR-2053".
- **Scrolling:** the column's card list scrolls inside the column with the header pinned; the app sets the column's height through `class`. dnd-kit's auto-scroll scrolls a column and the board's row near their edges.
- **Story:** "With dragging" on the skeleton, holding its cards in module-level `$state` and moving them in `onMove`, with one column that refuses.

## The demo: the Orders board

- **Five columns:** Received, Ready, In fulfilment, Completed, Cancelled (tone `critical`). `OPEN_STATUSES` is replaced: `BOARD_STATUSES` holds all five for the board; `FLOW_STATUSES` holds the four the stat tiles and their filters use.
- **Every card shows**; the `slice(0, 12)` goes. Columns are capped at the viewport's height below the toolbar and scroll.
- **Accepts and actions:**

  | Drop on | Accepts | What happens |
  | --- | --- | --- |
  | Ready | from Received | `markReady(store, id)`: status `ready`, an event in its history; toast "OR-2060 is ready" |
  | In fulfilment | from Ready | the "Put on a run" dialog |
  | Cancelled | from Received, Ready, In fulfilment | the page's existing confirm dialog, then `cancelOrder` |
  | Received, Completed | nothing | refused |

- **"Put on a run" dialog:** "Put OR-2053 on a run", a `Select` of the shipment runs still `scheduled` that leave from the order's origin. Confirm calls `addOrderToShipment(store, shipmentId, orderId)`, which goes through `updateShipment`, so the run's orders and stops stay in step; toast "OR-2053 is on SHP-3015". With no such run, the dialog says so and links to Plan a run (`/shipments/new`). Closing the dialog leaves the card in Ready.
- **`cancelOrder` takes the order off its run**, through `updateShipment`, when the order is in fulfilment. If the run is no longer `scheduled`, the cancel is refused: "OR-2039 is on SHP-3006, which is in transit". This applies to every Cancel in the demo (table row, order page, board).
- **Errors:** a refusal from the store becomes `toast.error` with its message; the card stays.
- **Persistence:** moves are store changes, saved like any other; Reset restores the seed. `SEED_VERSION` does not change: the seed is untouched.

## Testing

- **Data (example):** `markReady` (received only; event pushed), `addOrderToShipment` (ready and same origin only; stops replanned; refused for a run that is not scheduled), `cancelOrder` (takes an in-fulfilment order off its scheduled run; refuses when the run has left).
- **Board (mise):** `onMove` fires with `{ id, from, to }` on an accepted drop and not on a refused one or the card's own column; a board without `onMove` renders no drag handles or attributes; the keyboard path, if dnd-kit's keyboard sensor runs in jsdom. If it does not, the plan says so and the check moves to a browser script.
- **Visual:** stories screenshotted in both schemes; the example's smoke run covers the board with five columns; a drag driven through the DevTools protocol (pointer events at card and column centres) checks a real drop and a refused one.

## Out of scope

- Reordering cards within a column.
- Completing orders, from the board or anywhere: that needs a run delivery action on the shipment pages.
- Moves backwards (In fulfilment to Ready, Ready to Received).
- Generic Draggable, Droppable and Sortable parts.
