<!--
  With no icon the dot is a small filled circle: an empty disc would read as
  something that failed to load. TimelineSkeleton is the loading state.
-->
<script lang="ts">
  import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineSkeleton,
    TimelineTitle,
  } from '@jovertical/mise-design-system'
</script>

<div class="grid w-full max-w-2xl gap-8 md:grid-cols-2">
  <Timeline>
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
  <TimelineSkeleton />
</div>
