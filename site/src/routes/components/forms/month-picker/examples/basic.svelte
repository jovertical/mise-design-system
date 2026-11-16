<!-- A month and its year: the value is always the month's first day, a CalendarDate. -->
<script lang="ts">
  import { CalendarDate } from '@internationalized/date'
  import { MonthPicker } from '@jovertical/mise-design-system'

  let month: CalendarDate | undefined = $state(new CalendarDate(2026, 3, 1))
</script>

<div class="w-64"><MonthPicker bind:value={month} aria-label="Report month" /></div>
