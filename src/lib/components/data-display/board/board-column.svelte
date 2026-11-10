<!--
  Origin: mise
  Diverged: none. Part of Board, which mise authored (2026-11-09). With an
    `id` on a board with `onMove`, it takes dropped cards (2026-11-10).
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  import type { Tone } from '../../../utils/tone.js'
  import type { WithElementRef } from '../../../utils/types.js'
  import type { BoardAccepts } from './board-drag.svelte.js'

  /**
   * One lane of a board: a header naming the status, then its cards. A fixed
   * width, so a wide board scrolls instead of squeezing every card to nothing.
   * Pass no children for an empty column; wrap an `{#each}` in
   * `{#if items.length}`, since an `{#each}` that renders nothing still counts
   * as children.
   */
  export type BoardColumnProps = WithElementRef<Omit<HTMLAttributes<HTMLElement>, 'title'>> & {
    title: string | Snippet
    /** How many items the column holds, which may be more than it shows. */
    count?: number
    /** The dot beside the title. Neutral unless the status means something. */
    tone?: Tone
    /** Right of the title: a link to the full list, a menu. */
    actions?: Snippet
    /** Shown when the column has no cards, so it never collapses to its header. */
    empty?: string | Snippet
    /** Names the column, so cards can be dropped on it when the board has `onMove`. */
    id?: string
    /** Whether the column takes a card. By default, any card from another column. */
    accepts?: BoardAccepts
  }

  // One id per instance for aria-labelledby; $props.id() needs Svelte 5.20.
  let instances = 0
</script>

<script lang="ts">
  import { createDroppable } from '@dnd-kit/svelte'
  import { untrack } from 'svelte'
  import { cn } from '../../../utils/cn.js'

  import { TONE_FILL_CLASS } from '../../../utils/tone.js'
  import { getBoardDrag, setBoardColumn } from './board-drag.svelte.js'

  let {
    ref = $bindable(null),
    title,
    count,
    tone = 'neutral',
    actions,
    empty = 'Nothing here',
    id,
    accepts,
    class: className,
    children,
    ...rest
  }: BoardColumnProps = $props()

  const headingId = `board-column-${++instances}`

  const drag = getBoardDrag()

  // A column's id is fixed when it mounts: dnd-kit registers it once.
  const columnId = untrack(() => id)

  setBoardColumn({ id: columnId ?? '' })

  const droppable =
    drag && columnId
      ? createDroppable({
          id: columnId,
          accept: (source) =>
            drag.canDrop({ id: String(source.id), from: String(source.data?.from) }, columnId),
        })
      : undefined

  $effect(() => {
    if (!drag || !columnId) {
      return
    }

    return drag.register(columnId, {
      title: typeof title === 'string' ? title : columnId,
      accepts,
    })
  })

  /** The ring a column shows while it takes the card being moved. */
  const DROP_RING_CLASS: Record<Tone, string> = {
    neutral: 'data-[drop=accepts]:ring-foreground/20',
    primary: 'data-[drop=accepts]:ring-primary/40',
    info: 'data-[drop=accepts]:ring-info/40',
    success: 'data-[drop=accepts]:ring-success/40',
    warning: 'data-[drop=accepts]:ring-warning/40',
    critical: 'data-[drop=accepts]:ring-destructive/40',
  }

  const dropState = $derived(drag && columnId ? drag.dropState(columnId) : undefined)
</script>

<section
  bind:this={ref}
  data-slot="board-column"
  aria-labelledby={headingId}
  data-column={columnId}
  data-drop={dropState}
  {@attach (node) => droppable?.attach(node)}
  class={cn(
    'flex max-h-full min-h-0 w-72 shrink-0 flex-col gap-2 rounded-xl bg-foreground/[0.04] p-2 transition-[opacity,box-shadow]',
    // Inset: the board's row scrolls sideways and would clip a ring drawn outside.
    'data-[drop=accepts]:ring-2 data-[drop=accepts]:ring-inset data-[drop=refuses]:cursor-not-allowed data-[drop=refuses]:opacity-50',
    DROP_RING_CLASS[tone],
    className,
  )}
  {...rest}
>
  <header class="flex min-h-8 items-center gap-2 px-1">
    <span
      data-slot="board-column-dot"
      class={cn('size-2 shrink-0 rounded-full', TONE_FILL_CLASS[tone])}
    ></span>
    <h3 id={headingId} class="truncate text-sm font-medium">
      {#if typeof title === 'string'}
        {title}
      {:else}
        {@render title()}
      {/if}
    </h3>
    {#if count !== undefined}
      <span data-slot="board-column-count" class="text-muted-foreground text-sm tabular-nums">
        {count}
      </span>
    {/if}
    {#if actions}
      <div class="ml-auto">{@render actions()}</div>
    {/if}
  </header>
  {#if children}
    <div
      data-slot="board-column-cards"
      class="-m-1.5 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-1.5 [scrollbar-gutter:stable]"
    >
      {@render children()}
    </div>
  {:else}
    <p data-slot="board-column-empty" class="text-muted-foreground px-1 py-6 text-center text-sm">
      {#if typeof empty === 'string'}
        {empty}
      {:else}
        {@render empty()}
      {/if}
    </p>
  {/if}
</section>
