<!--
  Mutually exclusive options as a washed track with a lifted pill, the same
  shape as Tabs: the default for a preset picker, a time range, a view switch.
-->
<script lang="ts">
  import { ToggleGroup, ToggleGroupItem } from '@jovertical/mise-design-system'

  let range = $state('week')
</script>

<ToggleGroup type="single" variant="segmented" bind:value={range} aria-label="Range">
  <ToggleGroupItem value="day">Day</ToggleGroupItem>
  <ToggleGroupItem value="week">Week</ToggleGroupItem>
  <ToggleGroupItem value="month">Month</ToggleGroupItem>
</ToggleGroup>
