<!-- A single selectable date: the calendar DatePicker opens. Values are @internationalized/date dates. -->
<script lang="ts">
  import { CalendarDate, type DateValue } from '@internationalized/date'
  import { Calendar } from '@jovertical/mise-design-system'

  let value: DateValue | undefined = $state(new CalendarDate(2026, 3, 14))
</script>

<Calendar type="single" bind:value />
