<!--
  Origin: mise
  Diverged: none. Board has no React origin; mise authored it for the
    logistics example's Orders board (2026-11-09). Cards can be dragged between
    columns when the board has `onMove` (2026-11-10): pointer and touch through
    `@dnd-kit/svelte`, the keyboard through mise's own path; mise reports a drop
    and the app moves the card.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'
  import type { BoardMove } from './board-drag.svelte.js'

  /**
   * Columns of cards grouped by a status: a pipeline read across. The row
   * scrolls sideways rather than squeezing its columns, because a card needs
   * its width to say anything.
   *
   * With `onMove`, cards with an `id` can be dragged to columns with an `id`
   * that accept them. mise never moves a card: it reports the drop, and the
   * card moves when the app's data does.
   */
  export type BoardProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    onMove?: (move: BoardMove) => void
  }

  // One id per instance for the instructions; $props.id() needs Svelte 5.20.
  let instances = 0
</script>

<script lang="ts">
  import { DragDropProvider, DragOverlay, PointerSensor } from '@dnd-kit/svelte'
  import { type ComponentProps, untrack } from 'svelte'

  import { cn } from '../../../utils/cn.js'
  import { BoardDrag, setBoardDrag } from './board-drag.svelte.js'

  let { ref = $bindable(null), onMove, class: className, children, ...rest }: BoardProps = $props()

  // Whether the board drags is fixed when it mounts, like its columns' ids.
  const drag = untrack(() => onMove)
    ? new BoardDrag((move) => onMove?.(move), `board-instructions-${++instances}`)
    : undefined

  if (drag) {
    setBoardDrag(drag)
  }

  type ProviderProps = ComponentProps<typeof DragDropProvider>

  /**
   * dnd-kit's accessibility plugin gives every draggable `role="button"` and
   * its own announcements; mise announces through its live region, and a card
   * that is a link stays a link.
   */
  const plugins: ProviderProps['plugins'] = (defaults) =>
    defaults.filter((plugin) => (plugin as { name?: string }).name !== 'Accessibility')

  type DragStartEvent = Parameters<NonNullable<ProviderProps['onDragStart']>>[0]
  type DragEndEvent = Parameters<NonNullable<ProviderProps['onDragEnd']>>[0]

  function cardOf(source: DragEndEvent['operation']['source']) {
    if (!source) {
      return null
    }

    return { id: String(source.id), from: String(source.data?.from) }
  }

  function ondragstart(event: DragStartEvent) {
    if (!drag) {
      return
    }

    drag.dragging = cardOf(event.operation.source)
  }

  function ondragend(event: DragEndEvent) {
    if (!drag) {
      return
    }

    const card = cardOf(event.operation.source)
    const target = event.operation.target

    drag.dragging = null

    if (event.canceled || !card || !target) {
      return
    }

    drag.drop(card, String(target.id), String(event.operation.source?.data?.label ?? card.id))
  }
</script>

{#snippet row()}
  <div
    bind:this={ref}
    data-slot="board"
    class={cn('flex items-start gap-3 overflow-x-auto pb-2', className)}
    {...rest}
  >
    {@render children?.()}
  </div>
{/snippet}

{#if drag}
  <DragDropProvider
    sensors={[PointerSensor]}
    {plugins}
    onDragStart={ondragstart}
    onDragEnd={ondragend}
  >
    {@render row()}
    <DragOverlay>
      {#snippet children(source)}
        {@const content = drag.contents.get(String(source.id))}
        <div
          data-slot="board-card-overlay"
          class="bg-card text-card-foreground flex w-68 rotate-1 cursor-grabbing flex-col gap-1 rounded-lg border p-3 text-sm shadow-lg"
        >
          {@render content?.()}
        </div>
      {/snippet}
    </DragOverlay>
  </DragDropProvider>
  <p id={drag.instructionsId} class="sr-only">
    Press Space to pick a card up, Left and Right to move it, and Space to drop it.
  </p>
  <p data-slot="board-live" class="sr-only" aria-live="polite">{drag.message}</p>
{:else}
  {@render row()}
{/if}
