<script lang="ts">
  import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineTitle,
  } from '@jovertical/mise-design-system'
  import IconCircleCheck from '@tabler/icons-svelte-runes/icons/circle-check'
  import IconFilePlus from '@tabler/icons-svelte-runes/icons/file-plus'
</script>

<Timeline class="w-80">
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
