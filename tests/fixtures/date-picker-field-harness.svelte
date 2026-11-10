<script lang="ts">
  import { CalendarDate, type DateValue } from '@internationalized/date'
  import type { DateRange } from 'bits-ui'

  import { DatePicker, FieldLabel } from '../../src/lib/index.js'

  const short = (date: DateValue) =>
    `${String(date.month).padStart(2, '0')}/${String(date.day).padStart(2, '0')}/${String(date.year).slice(2)}`

  let day = $state<DateValue | undefined>(new CalendarDate(2026, 11, 2))

  let range = $state<DateRange | undefined>({
    start: new CalendarDate(2026, 11, 1),
    end: new CalendarDate(2026, 11, 7),
  })
</script>

<FieldLabel for="business-day">Business day</FieldLabel>
<DatePicker
  id="business-day"
  mode="single"
  bind:value={day}
  formatLabel={short}
  data-testid="single-trigger"
/>
<DatePicker
  mode="range"
  bind:value={range}
  formatLabel={(picked) =>
    `${short(picked.start as DateValue)} to ${short(picked.end as DateValue)}`}
  data-testid="range-trigger"
/>
<DatePicker mode="single" data-testid="empty-trigger" />
