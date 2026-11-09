<!--
  Origin: mise
  Diverged: none. Part of Board, which mise authored (2026-11-09).
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  import type { Tone } from '../../../utils/tone.js'
  import type { WithElementRef } from '../../../utils/types.js'

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
  }

  // One id per instance for aria-labelledby; $props.id() needs Svelte 5.20.
  let instances = 0
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { TONE_FILL_CLASS } from '../../../utils/tone.js'

  let {
    ref = $bindable(null),
    title,
    count,
    tone = 'neutral',
    actions,
    empty = 'Nothing here',
    class: className,
    children,
    ...rest
  }: BoardColumnProps = $props()

  const headingId = `board-column-${++instances}`
</script>

<section
  bind:this={ref}
  data-slot="board-column"
  aria-labelledby={headingId}
  class={cn('flex w-72 shrink-0 flex-col gap-2 rounded-xl bg-foreground/[0.04] p-2', className)}
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
    <div data-slot="board-column-cards" class="flex flex-col gap-2">{@render children()}</div>
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
