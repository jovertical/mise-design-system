<!--
  Origin: the React package 2.23.0 `stat-tile.tsx` (the label and the figure)
  Diverged: the column beside the chip, the label line with its hint and
    action, then the figure with its delta, unit and visual, as its own part so
    StatTile keeps under the size the clean-code guide allows. Not exported:
    StatTile renders it and hands it the `content` snippet both share.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'

  import type { Tone } from '../../../utils/tone.js'
  import type { StatSize } from './stat-tile-variants.js'

  export type StatTileHeadlineProps = {
    label: string
    value: string | number | Snippet | null
    unit?: string | Snippet
    exactValue?: string
    hint?: Snippet
    tone: Tone
    size: StatSize
    delta?: Snippet
    action?: Snippet
    visual?: Snippet
    inset: boolean
    hasValue: boolean
    loading: boolean
    error: boolean
    /** StatTile's own renderer for a string-or-snippet value. */
    content: Snippet<[string | number | Snippet]>
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { TONE_TEXT_CLASS } from '../../../utils/tone.js'
  import Skeleton from '../../feedback/skeleton/skeleton.svelte'
  import { SIZE_CLASS, SIZE_SKELETON_CLASS } from './stat-tile-variants.js'

  let {
    label,
    value,
    unit,
    exactValue,
    hint,
    tone,
    size,
    delta,
    action,
    visual,
    inset,
    hasValue,
    loading,
    error,
    content,
  }: StatTileHeadlineProps = $props()
</script>

<div class="min-w-0 flex-1">
  <!-- The action sits on the label's line, so it does not take the label's width. -->
  <div class="flex items-start justify-between gap-2">
    <div
      class={cn(
        'flex min-w-0 items-center gap-1.5',
        inset ? 'text-muted-foreground text-xs tracking-wide uppercase' : 'text-foreground',
      )}
    >
      <p class={cn(!inset && 'text-sm font-medium')}>{label}</p>
      {@render hint?.()}
    </div>
    {#if action}
      <div class="-mt-1 shrink-0">{@render action()}</div>
    {/if}
  </div>

  {#if loading}
    <Skeleton class={cn('mt-1.5', SIZE_SKELETON_CLASS[size])} />
  {:else}
    <div class="mt-0.5">
      <div class="flex min-w-0 items-center justify-between gap-3">
        <div class="min-w-0 flex-1">
          <!-- The figure and its delta, and nothing else: one statement. -->
          <div class="flex flex-wrap items-baseline gap-2">
            <div
              class={cn(
                'font-heading font-bold tabular-nums',
                SIZE_CLASS[size],
                TONE_TEXT_CLASS[tone],
              )}
              title={hasValue ? exactValue : undefined}
            >
              {#if hasValue && value !== null}
                {@render content(value)}
              {:else}
                —
              {/if}
            </div>
            {#if delta && !error}
              {@render delta()}
            {/if}
          </div>
          {#if unit}
            <div class="text-muted-foreground mt-0.5 text-xs">{@render content(unit)}</div>
          {/if}
        </div>
        {#if visual}
          <div class="w-1/2 min-w-0 shrink">{@render visual()}</div>
        {/if}
      </div>
    </div>
  {/if}
</div>
