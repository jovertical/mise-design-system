<!--
  Origin: the React package 2.23.0 `segmented-bar.tsx`
  Diverged: takes `class` and spreads the rest onto the root, as every
    component does.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import { TONE_SOLID_CLASS, type Tone } from '../../../utils/tone.js'

  /**
   * A segment is a solid fill, except the neutral one, which is the track's own
   * colour: "everything else" should recede behind the named slices.
   */
  const SEGMENT_CLASS: Record<Tone, string> = {
    ...TONE_SOLID_CLASS,
    neutral: 'bg-muted text-muted-foreground',
  }

  /**
   * `md` is the dashboard bar, tall enough to print each share inside it under
   * its captions. `sm` is the same data at table-row scale: a rule, for a cell
   * whose exact figures are the columns either side.
   */
  export type SegmentedBarSize = 'sm' | 'md'

  const BAR_SIZE_CLASS: Record<SegmentedBarSize, string> = {
    md: 'h-10 rounded-2xl',
    sm: 'h-2 rounded-full',
  }

  export type Segment = {
    label: string
    /** In whatever unit the caller counts in. Shares come from the total. */
    value: number
    tone?: Tone
  }

  /**
   * A whole, divided into named parts. One bar rather than one per part,
   * because the question is how the total splits.
   *
   * A share below about 6% cannot hold its own percentage, so the text is
   * dropped rather than shrunk or spilled; the caption still names it.
   * Segments are drawn in the order given: sorting by size would make the same
   * data look different week to week.
   */
  export type SegmentedBarProps = HTMLAttributes<HTMLDivElement> & {
    segments: Segment[]
    /** Print each share inside its segment. Off when the bar heads a list below. */
    showShare?: boolean
    /** Captions above the bar, each over the segment it names. */
    showLabels?: boolean
    size?: SegmentedBarSize
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    segments,
    showShare = true,
    showLabels = true,
    size = 'md',
    class: className,
    ...rest
  }: SegmentedBarProps = $props()

  const total = $derived(segments.reduce((sum, segment) => sum + segment.value, 0))
  const shares = $derived(segments.map((segment) => (segment.value / total) * 100))
  /** At 8px there is no room for captions or shares, so `sm` drops them. */
  const slim = $derived(size === 'sm')
  const printsLabels = $derived(showLabels && !slim)
  const printsShare = $derived(showShare && !slim)
</script>

{#if total <= 0}
  <div
    data-slot="segmented-bar"
    class={cn('bg-muted w-full', BAR_SIZE_CLASS[size], className)}
    {...rest}
  ></div>
{:else}
  <div data-slot="segmented-bar" class={cn('w-full', className)} {...rest}>
    {#if printsLabels}
      <div class="flex w-full">
        {#each segments as segment, index (segment.label)}
          <div class="min-w-0 pr-2" style:width="{shares[index]}%">
            <p class="text-muted-foreground truncate text-sm">{segment.label}</p>
            <span aria-hidden="true" class="bg-muted-foreground/60 mt-1 block h-2 w-px"></span>
          </div>
        {/each}
      </div>
    {/if}

    <div class={cn('flex w-full overflow-hidden', BAR_SIZE_CLASS[size], printsLabels && 'mt-2')}>
      {#each segments as segment, index (segment.label)}
        <div
          data-slot="segmented-bar-segment"
          class={cn(
            'flex items-center text-sm font-medium tabular-nums',
            !slim && 'px-3',
            SEGMENT_CLASS[segment.tone ?? 'neutral'],
          )}
          style:width="{shares[index]}%"
          title="{segment.label}: {segment.value}"
        >
          {#if printsShare && shares[index] >= 6}
            {shares[index].toFixed(1)}%
          {/if}
        </div>
      {/each}
    </div>
  </div>
{/if}
