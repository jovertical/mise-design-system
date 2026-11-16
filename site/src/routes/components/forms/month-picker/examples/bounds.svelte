<!--
  `minValue` and `maxValue` bound it by month: November 2025 to April 2026,
  the months a ledger has. The year arrows stop at the ends.
-->
<script lang="ts">
  import { CalendarDate } from '@internationalized/date'
  import { MonthPicker } from '@jovertical/mise-design-system'

  let month: CalendarDate | undefined = $state(new CalendarDate(2026, 3, 1))
</script>

<div class="w-64">
  <MonthPicker
    bind:value={month}
    minValue={new CalendarDate(2025, 11, 1)}
    maxValue={new CalendarDate(2026, 4, 1)}
    aria-label="Ledger month"
  />
</div>
