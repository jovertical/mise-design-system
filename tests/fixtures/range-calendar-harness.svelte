<script lang="ts">
  import { CalendarDate, type DateValue } from '@internationalized/date'

  import { RangeCalendar } from '../../src/lib/index.js'

  let value = $state<{ start: DateValue | undefined; end: DateValue | undefined }>({
    start: undefined,
    end: undefined,
  })
</script>

<RangeCalendar bind:value placeholder={new CalendarDate(2026, 3, 14)} />
<output data-testid="value">{value.start?.toString() ?? ''}..{value.end?.toString() ?? ''}</output>
