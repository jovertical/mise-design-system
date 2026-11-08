<!--
  Origin: the React package 2.23.0 `timeline.tsx` (`TimelineSkeleton`)
  Diverged: spreads the rest onto the list, as every component does.
-->
<script lang="ts" module>
  import type { TimelineProps } from './timeline.svelte'

  /** A timeline's loading state: neutral pulsing badges and bars in place of text. */
  export type TimelineSkeletonProps = Omit<TimelineProps, 'children'> & {
    /** How many placeholder entries. */
    count?: number
  }
</script>

<script lang="ts">
  import Skeleton from '../../feedback/skeleton/skeleton.svelte'
  import Timeline from './timeline.svelte'
  import TimelineConnector from './timeline-connector.svelte'
  import TimelineContent from './timeline-content.svelte'
  import TimelineDot from './timeline-dot.svelte'
  import TimelineItem from './timeline-item.svelte'
  import TimelineTitle from './timeline-title.svelte'

  let { count = 3, ...rest }: TimelineSkeletonProps = $props()

  const entries = $derived(Array.from({ length: count }, (_, index) => index))
</script>

<Timeline data-slot="timeline-skeleton" {...rest}>
  {#each entries as index (index)}
    <TimelineItem>
      <TimelineDot tone="neutral" class="animate-pulse" />
      {#if index < count - 1}
        <TimelineConnector />
      {/if}
      <TimelineTitle><Skeleton class="h-3.5 w-40" /></TimelineTitle>
      <TimelineContent>
        <Skeleton class="h-3 w-56" />
        <Skeleton class="h-3 w-32" />
      </TimelineContent>
    </TimelineItem>
  {/each}
</Timeline>
