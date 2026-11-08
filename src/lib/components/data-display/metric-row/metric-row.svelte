<!--
  Origin: the React package 2.23.0 `metric-row.tsx`
  Diverged: `icon` is a snippet, and `label`, `description`, `trailing` and a
    stat's `label` and `value` take a string or a snippet, as R4-5 has a
    ReactNode prop. Takes `class` and spreads the rest onto the root, as every
    component does.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  import type { Tone } from '../../../utils/tone.js'

  export type MetricRowStat = {
    /** Stable key. Labels repeat down a list, so they are not one. */
    id: string
    /**
     * The caption over the figure. Optional: a lone `56%` beside its own bar
     * explains itself.
     */
    label?: string | Snippet
    value: string | number | Snippet
    /**
     * Colours the figure only. A row where every stat is tinted reads as an
     * alert, the opposite of what a scannable list needs.
     */
    tone?: Tone
  }

  /**
   * A subject, the figures that describe it, and one bar beneath them all.
   *
   * Not `MetricBar` on two counts. Several labelled figures, not one: `80%`,
   * `3`, `1` side by side say nothing without their captions. And the bar runs
   * the full width, under the chip too, because it summarises the row rather
   * than belonging to any one figure. Reach for `MetricBar` when the bar is the
   * point; for this when the row is a thing with several measurements.
   */
  export type MetricRowProps = HTMLAttributes<HTMLDivElement> & {
    /** A glyph in a `md` `IconChip` before the label. */
    icon?: Snippet
    /** A place in a ranking, as `MetricRank`. Pass `icon` or `rank`, not both. */
    rank?: number
    label: string | Snippet
    /** A muted line under the title. */
    description?: string | Snippet
    /** The figures along the top right, each under its own caption. */
    stats?: MetricRowStat[]
    /** How full the bar is, 0–100. Clamped: over 100 is a bug upstream. */
    percent: number
    tone?: Tone
    /**
     * Beside the bar: `398 / 500 units`. Inline, it takes a right-aligned slot
     * with a floor width, so every row's bar starts and ends at the same x.
     * `null` holds the slot empty; leave it out to give the slot up.
     */
    trailing?: string | Snippet | null
    /**
     * `below`, the default, runs the bar the full width under the row, for a
     * row whose bar belongs to no figure in particular. `inline` puts it before
     * the figures at a fixed width, for one figure the bar is a picture of.
     */
    barPlacement?: 'below' | 'inline'
    /** Hides the bar, for a row with nothing to measure: an empty bar reads as a failure. */
    hideBar?: boolean
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { TONE_INDICATOR_CLASS, TONE_TEXT_CLASS } from '../../../utils/tone.js'
  import Progress from '../../feedback/progress/progress.svelte'
  import IconChip from '../icon-chip/icon-chip.svelte'
  import MetricRank from '../metric-bar/metric-rank.svelte'

  let {
    icon,
    rank,
    label,
    description,
    stats,
    percent,
    tone = 'primary',
    trailing,
    barPlacement = 'below',
    hideBar = false,
    class: className,
    ...rest
  }: MetricRowProps = $props()

  const clamped = $derived(Math.min(100, Math.max(0, percent)))
  const inline = $derived(barPlacement === 'inline')
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

{#snippet bar()}
  <Progress value={clamped} aria-label={barLabel} class={cn('h-2', TONE_INDICATOR_CLASS[tone])} />
{/snippet}

<div data-slot="metric-row" class={cn('flex flex-col gap-3', className)} {...rest}>
  <div class="flex items-start justify-between gap-4">
    <div class="flex min-w-0 items-center gap-3">
      {#if icon}
        <IconChip size="md">{@render icon()}</IconChip>
      {/if}
      {#if rank !== undefined}
        <MetricRank {rank} />
      {/if}
      <div class="min-w-0">
        <div class="truncate text-sm font-medium">{@render content(label)}</div>
        {#if description}
          <div class="text-muted-foreground truncate text-xs">{@render content(description)}</div>
        {/if}
      </div>
    </div>

    <!-- Inline keeps one baseline; below, the figures stack over their captions. -->
    <div
      class={cn('flex shrink-0 items-center gap-5 text-right sm:gap-6', !inline && 'items-start')}
    >
      {#if inline && !hideBar}
        <div class="w-24 sm:w-32">{@render bar()}</div>
      {/if}

      {#each stats ?? [] as stat (stat.id)}
        <div>
          {#if stat.label !== undefined}
            <div class="text-muted-foreground text-xs whitespace-nowrap">
              {@render content(stat.label)}
            </div>
          {/if}
          <div
            class={cn(
              'text-sm font-semibold tabular-nums',
              stat.tone === undefined || stat.tone === 'neutral'
                ? 'text-foreground'
                : TONE_TEXT_CLASS[stat.tone],
            )}
          >
            {@render content(stat.value)}
          </div>
        </div>
      {/each}

      {#if inline && trailing !== undefined}
        <div class="min-w-20 shrink-0 text-right tabular-nums">
          {#if trailing !== null}
            {@render content(trailing)}
          {/if}
        </div>
      {/if}
    </div>
  </div>

  {#if !inline && !hideBar}
    <div class="flex items-center gap-3">
      <div class="flex-1">{@render bar()}</div>
      {#if trailing}
        <div class="text-muted-foreground shrink-0 text-xs tabular-nums">
          {@render content(trailing)}
        </div>
      {/if}
    </div>
  {/if}
</div>
