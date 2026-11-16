<!-- `indicator` marks the dot's edge without moving the columns: here, the author has the page open. -->
<script lang="ts">
  import {
    PresenceDot,
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineTitle,
  } from '@jovertical/mise-design-system'
  import IconHeadset from '@tabler/icons-svelte-runes/icons/headset'
  import IconUser from '@tabler/icons-svelte-runes/icons/user'
</script>

{#snippet hereNow()}
  <PresenceDot label="Here now" />
{/snippet}

<Timeline class="w-full max-w-md">
  <TimelineItem>
    <TimelineDot tone="primary" indicator={hereNow}><IconHeadset /></TimelineDot>
    <TimelineConnector />
    <TimelineTitle>Mia · Support</TimelineTitle>
    <TimelineContent><p>Try reseating the paper roll.</p></TimelineContent>
  </TimelineItem>
  <TimelineItem>
    <TimelineDot tone="neutral"><IconUser /></TimelineDot>
    <TimelineTitle>Eli Santos</TimelineTitle>
    <TimelineContent><p>The receipt printer prints blank.</p></TimelineContent>
  </TimelineItem>
</Timeline>
