<script lang="ts">
  import {
    PresenceDot,
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineTitle,
  } from '../../src/lib/index.js'
</script>

{#snippet here()}
  <PresenceDot label="Here now" />
{/snippet}

<Timeline>
  <TimelineItem>
    <TimelineDot tone="critical" indicator={here}><span data-testid="icon">!</span></TimelineDot>
    <TimelineConnector />
    <TimelineTitle>Order cancelled</TimelineTitle>
    <TimelineContent>Dana · 11 Jul 2026</TimelineContent>
  </TimelineItem>
  <TimelineItem>
    <TimelineDot />
    <TimelineTitle>Order created</TimelineTitle>
    <TimelineContent>Dana · 10 Jul 2026</TimelineContent>
  </TimelineItem>
</Timeline>
