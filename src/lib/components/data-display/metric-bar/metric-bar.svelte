<!--
  Origin: the React package 2.23.0 `metric-bar.tsx` (`MetricBar`)
  Diverged: `icon` is a snippet, and `label`, `value`, `description` and
    `trailing` take a string or a snippet, as R4-5 has a ReactNode prop. Takes
    `class` and spreads the rest onto the root, as every component does.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  import type { Tone } from '../../../utils/tone.js'

  /**
   * One measure, stated and then drawn. The figure is the answer and the bar
   * is the context: a reader who wants the value should not estimate it from a
   * length, and a reader comparing rows scans the bars, not the digits. So the
   * figure sits on the label's line.
   *
   * Tone colours the fill only. Colouring one bar red says act on it;
   * colouring all of them says nothing.
   *
   * Every slot is a `div`, since any of them may hold a block, such as a
   * `Skeleton`.
   */
  export type MetricBarProps = HTMLAttributes<HTMLDivElement> & {
    label: string | Snippet
    /** How full the bar is, 0–100. Clamped: over 100 is a bug upstream. */
    percent: number
    /** The figure the bar shows, at the label's right edge. */
    value?: string | number | Snippet
    /** A muted line under the label. */
    description?: string | Snippet
    /** A glyph in a `md` `IconChip` before the label: what the row is about. */
    icon?: Snippet
    /**
     * The row's place in a ranking, as a `MetricRank` before the label, for a
     * list whose order is the point. Pass `icon` or `rank`, not both.
     */
    rank?: number
    /**
     * Beside the bar, on its line: `398 / 500 units`. The bar shortens to make
     * room; a figure that qualifies the bar belongs on the bar's line.
     */
    trailing?: string | Snippet
    /** The fill. `primary` by default; a status only where the reader should act. */
    tone?: Tone
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { TONE_INDICATOR_CLASS } from '../../../utils/tone.js'
  import Progress from '../../feedback/progress/progress.svelte'
  import IconChip from '../icon-chip/icon-chip.svelte'
  import MetricRank from './metric-rank.svelte'

  let {
    label,
    percent,
    value,
    description,
    icon,
    rank,
    trailing,
    tone = 'primary',
    class: className,
    ...rest
  }: MetricBarProps = $props()

  const clamped = $derived(Math.min(100, Math.max(0, percent)))
  /** The bar is data, so it needs a name of its own; the label is a separate node. */
  const barLabel = $derived(
    typeof label === 'string' ? `${label}: ${clamped.toFixed(0)}%` : undefined,
  )
</script>

{#snippet content(node: string | number | Snippet)}
  {#if typeof node === 'function'}
    {@render node()}
  {:else}
    {node}
  {/if}
{/snippet}

<div data-slot="metric-bar" class={cn('flex items-start gap-3', className)} {...rest}>
  {#if icon}
    <IconChip size="md">{@render icon()}</IconChip>
  {/if}
  {#if rank !== undefined}
    <MetricRank {rank} />
  {/if}

  <div class="min-w-0 flex-1">
    <div class="flex items-baseline justify-between gap-3">
      <div class="min-w-0 truncate text-sm font-medium">{@render content(label)}</div>
      {#if value !== undefined}
        <div class="text-muted-foreground shrink-0 text-sm tabular-nums">
          {@render content(value)}
        </div>
      {/if}
    </div>

    {#if description}
      <div class="text-muted-foreground mt-0.5 truncate text-xs">
        {@render content(description)}
      </div>
    {/if}

    <div class="mt-2 flex items-center gap-3">
      <Progress
        value={clamped}
        aria-label={barLabel}
        class={cn('flex-1', TONE_INDICATOR_CLASS[tone])}
      />
      {#if trailing}
        <div class="text-muted-foreground shrink-0 text-xs tabular-nums">
          {@render content(trailing)}
        </div>
      {/if}
    </div>
  </div>
</div>
