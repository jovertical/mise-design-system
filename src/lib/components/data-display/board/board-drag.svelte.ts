/**
 * Origin: mise
 * Diverged: none. What a Board knows while a card is dragged: its columns in
 *   order, whether a column takes a card, and the keyboard path. The pointer
 *   path (dnd-kit) and the keyboard path both drop through `drop`, so one rule
 *   decides and one live region speaks (2026-11-10).
 */
import { getContext, type Snippet, setContext } from 'svelte'
import { SvelteMap } from 'svelte/reactivity'

/** A drop the app is asked to make: card `id` from column `from` to column `to`. */
export type BoardMove = { id: string; from: string; to: string }

/** A card being dragged, and the column it sits in. */
export type BoardCardRef = { id: string; from: string }

/** Whether a column takes a card. By default, any card from another column. */
export type BoardAccepts = (card: BoardCardRef) => boolean

type Column = { title: string; accepts?: BoardAccepts }

const KEY = Symbol('board-drag')
const COLUMN_KEY = Symbol('board-column')

export class BoardDrag {
  readonly #onMove: (move: BoardMove) => void
  readonly #columns = new SvelteMap<string, Column>()

  /** The id of the hidden text telling a screen reader how to move a card. */
  readonly instructionsId: string

  /** The card picked up from the keyboard. */
  held = $state<BoardCardRef | null>(null)
  /** The card a pointer is dragging. */
  dragging = $state<BoardCardRef | null>(null)
  over = $state<string | null>(null)
  message = $state('')

  #heldLabel = ''

  /**
   * Each card's content, so the overlay can draw the card being dragged: the
   * card itself stays in its column, which may scroll and would clip it.
   */
  readonly contents = new Map<string, Snippet>()

  constructor(onMove: (move: BoardMove) => void, instructionsId = 'board-instructions') {
    this.#onMove = onMove
    this.instructionsId = instructionsId
  }

  /** The card being moved, by either path. */
  get active(): BoardCardRef | null {
    return this.held ?? this.dragging
  }

  /** How a column answers the card being moved: nothing for the card's own column. */
  dropState(columnId: string): 'accepts' | 'refuses' | undefined {
    const card = this.active

    if (!card || card.from === columnId) {
      return undefined
    }

    return this.canDrop(card, columnId) ? 'accepts' : 'refuses'
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

/** A column tells its cards which column they sit in. */
export function setBoardColumn(column: { readonly id: string }) {
  setContext(COLUMN_KEY, column)
}

export function getBoardColumn(): { readonly id: string } | undefined {
  return getContext<{ readonly id: string } | undefined>(COLUMN_KEY)
}
