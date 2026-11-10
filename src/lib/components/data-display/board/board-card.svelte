<!--
  Origin: mise
  Diverged: none. Part of Board, which mise authored (2026-11-09). With an
    `id` on a board with `onMove`, it can be dragged to another column, by
    pointer, touch or keyboard (2026-11-10).
-->
<script lang="ts" module>
  import type { HTMLAnchorAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * One item in a column, on a card surface. With `href` it is a link to the
   * item: its hover darkens the border rather than tinting the fill, because
   * `--accent` is the active nav row and nothing else.
   */
  export type BoardCardProps = WithElementRef<HTMLAnchorAttributes> & {
    /** Names the card, so it can be dragged when the board has `onMove`. */
    id?: string
    /** What a screen reader calls the card while it moves. Defaults to its `id`. */
    label?: string
  }
</script>

<script lang="ts">
  import { createDraggable, PointerSensor } from '@dnd-kit/svelte'
  import { untrack } from 'svelte'

  import { cn } from '../../../utils/cn.js'
  import { type BoardDrag, getBoardColumn, getBoardDrag } from './board-drag.svelte.js'

  let {
    ref = $bindable(null),
    href,
    id,
    label,
    class: className,
    children,
    onkeydown,
    ...rest
  }: BoardCardProps = $props()

  const drag = getBoardDrag()
  const column = getBoardColumn()

  // A card's id is fixed when it mounts: dnd-kit registers it once.
  const cardId = untrack(() => id)
  const movable = Boolean(drag && cardId && column?.id)
  const name = $derived(label ?? cardId ?? '')

  const draggable =
    movable && cardId
      ? createDraggable({
          id: cardId,
          // The keyboard path is mise's own (Left and Right step columns);
          // dnd-kit's keyboard sensor would nudge the card 10px instead.
          sensors: [PointerSensor],
          get data() {
            return { from: column?.id ?? '', label: name }
          },
        })
      : undefined

  $effect(() => {
    if (!drag || !cardId || !children) {
      return
    }

    drag.contents.set(cardId, children)

    return () => drag.contents.delete(cardId)
  })

  const card = $derived({ id: cardId ?? '', from: column?.id ?? '' })
  const held = $derived(Boolean(drag?.held?.id === cardId || draggable?.isDragSource))

  /** While this card is held: Left and Right step, Space or Enter drops, Escape cancels. */
  const HELD_KEYS: Record<string, (model: BoardDrag) => void> = {
    ArrowLeft: (model) => model.step(-1),
    ArrowRight: (model) => model.step(1),
    ' ': (model) => model.commit(),
    Enter: (model) => model.commit(),
    Escape: (model) => model.cancel(),
  }

  /** Space picks a card up when nothing is held; Enter is left to the link. */
  function keyboardMove(event: KeyboardEvent, model: BoardDrag) {
    if (model.held?.id === cardId) {
      const action = HELD_KEYS[event.key]

      if (!action) {
        return
      }

      event.preventDefault()

      action(model)

      return
    }

    if (event.key !== ' ' || model.held) {
      return
    }

    event.preventDefault()

    model.pickUp(card, name)
  }

  function onkeydownCard(event: KeyboardEvent & { currentTarget: EventTarget & HTMLElement }) {
    // dnd-kit's own listener runs first and may already have prevented the
    // default, so only the caller's handler can stop the keyboard path.
    const preventedBefore = event.defaultPrevented

    onkeydown?.(event as never)

    const preventedByCaller = !preventedBefore && event.defaultPrevented

    if (preventedByCaller || !drag || !movable) {
      return
    }

    keyboardMove(event, drag)
  }
</script>

<svelte:element
  this={href ? 'a' : 'div'}
  bind:this={ref}
  {href}
  data-slot="board-card"
  data-held={held || undefined}
  role={movable && href ? 'link' : undefined}
  tabindex={movable && !href ? 0 : undefined}
  aria-roledescription={movable ? 'draggable card' : undefined}
  aria-describedby={movable ? drag?.instructionsId : undefined}
  class={cn(
    'bg-card text-card-foreground flex shrink-0 flex-col gap-1 rounded-lg border p-3 text-sm shadow-xs',
    movable && 'cursor-grab touch-manipulation active:cursor-grabbing data-[held]:opacity-50',
    href &&
      'hover:border-foreground/20 focus-visible:ring-ring/50 outline-none transition-colors focus-visible:ring-[3px]',
    className,
  )}
  onkeydown={onkeydownCard}
  {@attach (node: HTMLElement) => draggable?.attach(node)}
  {...rest}
>
  {@render children?.()}
</svelte:element>
