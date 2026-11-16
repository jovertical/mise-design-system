<!--
  Newest first. Only the dot carries status: the title stays in ink and the
  meta line muted, because a row that shouts in three places has no emphasis
  left for the one that matters.
-->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardTitle,
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineTitle,
  } from '@jovertical/mise-design-system'
  import IconBan from '@tabler/icons-svelte-runes/icons/ban'
  import IconCircleCheck from '@tabler/icons-svelte-runes/icons/circle-check'
  import IconFilePlus from '@tabler/icons-svelte-runes/icons/file-plus'
</script>

<Card class="w-full max-w-lg">
  <CardContent class="space-y-4">
    <CardTitle>Activity</CardTitle>
    <Timeline>
      <TimelineItem>
        <TimelineDot tone="critical"><IconBan /></TimelineDot>
        <TimelineConnector />
        <TimelineTitle>Order cancelled</TimelineTitle>
        <TimelineContent>
          <p>Dana Reyes · 11 Jul 2026, 09:00</p>
          <p>Cancellation reason: Customer request</p>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineDot tone="success"><IconCircleCheck /></TimelineDot>
        <TimelineConnector />
        <TimelineTitle>Order confirmed</TimelineTitle>
        <TimelineContent><p>System · 10 Jul 2026, 11:00</p></TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineDot><IconFilePlus /></TimelineDot>
        <TimelineTitle>Order created</TimelineTitle>
        <TimelineContent><p>Dana Reyes · 10 Jul 2026, 09:00</p></TimelineContent>
      </TimelineItem>
    </Timeline>
  </CardContent>
</Card>
