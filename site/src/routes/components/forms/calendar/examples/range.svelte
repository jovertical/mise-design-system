<!--
  RangeCalendar: a contiguous span, for a reporting window. The first click
  sets `start`; the second sets `end`.
-->
<script lang="ts">
  import { CalendarDate, type DateValue } from '@internationalized/date'
  import { RangeCalendar } from '@jovertical/mise-design-system'

  let value: { start: DateValue | undefined; end: DateValue | undefined } = $state({
    start: new CalendarDate(2026, 3, 9),
    end: new CalendarDate(2026, 3, 13),
  })
</script>

<RangeCalendar bind:value />
