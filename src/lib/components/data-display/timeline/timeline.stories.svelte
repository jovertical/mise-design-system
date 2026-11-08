<script module lang="ts">
  import BanIcon from '@lucide/svelte/icons/ban'
  import CircleCheckIcon from '@lucide/svelte/icons/circle-check'
  import ClockIcon from '@lucide/svelte/icons/clock'
  import FilePlusIcon from '@lucide/svelte/icons/file-plus'
  import HeadsetIcon from '@lucide/svelte/icons/headset'
  import UserIcon from '@lucide/svelte/icons/user'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import { TONES } from '../../../utils/tone.js'
  import Card from '../../layout/card/card.svelte'
  import CardContent from '../../layout/card/card-content.svelte'
  import CardTitle from '../../layout/card/card-title.svelte'
  import PresenceDot from '../avatar/presence-dot.svelte'
  import Timeline from './timeline.svelte'
  import TimelineConnector from './timeline-connector.svelte'
  import TimelineContent from './timeline-content.svelte'
  import TimelineDot from './timeline-dot.svelte'
  import TimelineItem from './timeline-item.svelte'
  import TimelineSkeleton from './timeline-skeleton.svelte'
  import TimelineTitle from './timeline-title.svelte'

  const { Story } = defineMeta({
    title: 'Data display/Timeline',
    component: Timeline,
    tags: ['mise'],
  })
</script>

{#snippet hereNow()}
  <PresenceDot label="Here now" />
{/snippet}

<!--
  The reference arrangement: newest first, the entry the reader lands on marked
  solid, the rest soft. Note what is *not* coloured: only the badge carries
  status. The title stays in ink and the meta line stays muted, because a row
  that shouts in three places has no emphasis left for the one that matters.
-->
<Story name="Playground" asChild>
  <Card class="max-w-lg">
    <CardContent class="space-y-4">
      <CardTitle>Activity</CardTitle>
      <Timeline>
        <TimelineItem>
          <TimelineDot tone="critical"><BanIcon /></TimelineDot>
          <TimelineConnector />
          <TimelineTitle>Order cancelled</TimelineTitle>
          <TimelineContent>
            <p>Dana Reyes · 11 Jul 2026, 09:00</p>
            <p>Cancellation reason: Customer request</p>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineDot tone="success"><CircleCheckIcon /></TimelineDot>
          <TimelineConnector />
          <TimelineTitle>Order confirmed</TimelineTitle>
          <TimelineContent><p>System · 10 Jul 2026, 11:00</p></TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineDot><FilePlusIcon /></TimelineDot>
          <TimelineTitle>Order created</TimelineTitle>
          <TimelineContent><p>Dana Reyes · 10 Jul 2026, 09:00</p></TimelineContent>
        </TimelineItem>
      </Timeline>
    </CardContent>
  </Card>
</Story>

<!-- Every tone, so the wash strengths can be compared against each other. -->
<Story name="Tones" asChild>
  <Timeline class="max-w-md">
    {#each TONES as tone, index (tone)}
      <TimelineItem>
        <TimelineDot {tone}><ClockIcon /></TimelineDot>
        {#if index < TONES.length - 1}
          <TimelineConnector />
        {/if}
        <TimelineTitle class="capitalize">{tone}</TimelineTitle>
        <TimelineContent><p>Shift opened · 08:00</p></TimelineContent>
      </TimelineItem>
    {/each}
  </Timeline>
</Story>

<!-- Loading: neutral pulsing badges and bars in place of text. -->
<Story name="States" asChild>
  <TimelineSkeleton class="max-w-md" />
</Story>

<!--
  `indicator` puts a mark on the badge's edge without moving the columns: a
  `PresenceDot` while that entry's author has the page open, as a support
  conversation shows.
-->
<Story name="With presence" asChild>
  <Timeline class="max-w-md">
    <TimelineItem>
      <TimelineDot tone="primary" indicator={hereNow}><HeadsetIcon /></TimelineDot>
      <TimelineConnector />
      <TimelineTitle>Mia · Support</TimelineTitle>
      <TimelineContent><p>Try reseating the paper roll.</p></TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineDot tone="neutral"><UserIcon /></TimelineDot>
      <TimelineTitle>Eli Santos</TimelineTitle>
      <TimelineContent><p>The receipt printer prints blank.</p></TimelineContent>
    </TimelineItem>
  </Timeline>
</Story>

<!--
  With no icon, the badge falls back to a small filled circle. An empty 32px
  disc reads as something that failed to load, and most timelines have a
  status but no glyph for it.
-->
<Story name="Without icons" asChild>
  <Timeline class="max-w-md">
    <TimelineItem>
      <TimelineDot tone="success" />
      <TimelineConnector />
      <TimelineTitle>Delivered</TimelineTitle>
      <TimelineContent><p>12 Jul 2026, 14:20</p></TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineDot tone="info" />
      <TimelineConnector />
      <TimelineTitle>Out for delivery</TimelineTitle>
      <TimelineContent><p>12 Jul 2026, 08:05</p></TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineDot tone="neutral" />
      <TimelineTitle>Packed</TimelineTitle>
      <TimelineContent><p>11 Jul 2026, 17:40</p></TimelineContent>
    </TimelineItem>
  </Timeline>
</Story>

<!--
  A one-line body is where an absolutely positioned connector broke down.
  `min-h-6` holds a visible run of line so the badges keep their rhythm.
-->
<Story name="Short entries" asChild>
  <Timeline class="max-w-md">
    {#each ['Created', 'Paired', 'Revoked'] as step, index (step)}
      <TimelineItem>
        <TimelineDot tone={index === 0 ? 'primary' : 'neutral'} />
        {#if index < 2}
          <TimelineConnector />
        {/if}
        <TimelineTitle>{step}</TimelineTitle>
        <TimelineContent><p>10 Jul 2026</p></TimelineContent>
      </TimelineItem>
    {/each}
  </Timeline>
</Story>
