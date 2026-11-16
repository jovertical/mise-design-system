<!--
  A start-to-end span. The trigger shows the start until the end is picked,
  then both; the calendar closes only once it has both ends. `minValue` greys
  out the days before it: the floor is the caller's, not a disablePast flag.
-->
<script lang="ts">
  import { CalendarDate } from '@internationalized/date'
  import { DatePicker } from '@jovertical/mise-design-system'
  import type { DateRange } from 'bits-ui'

  const TODAY = new CalendarDate(2026, 3, 14)

  let window: DateRange | undefined = $state({ start: TODAY, end: undefined })
</script>

<div class="w-80">
  <DatePicker mode="range" bind:value={window} minValue={TODAY} aria-label="Reporting window" />
</div>
