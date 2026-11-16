<!--
  Disabled, for a field the operator cannot edit yet; invalid; and a custom
  label through `formatLabel`, as a paper log writes dates.
-->
<script lang="ts">
  import { CalendarDate } from '@internationalized/date'
  import { DatePicker } from '@jovertical/mise-design-system'

  const pad = (part: number) => String(part).padStart(2, '0')
</script>

<div class="flex w-64 flex-col gap-3">
  <DatePicker mode="single" disabled placeholder="Disabled" aria-label="Disabled" />
  <DatePicker mode="single" aria-invalid placeholder="Invalid" aria-label="Invalid" />
  <DatePicker
    mode="single"
    value={new CalendarDate(2026, 3, 14)}
    formatLabel={(day) => `${pad(day.month)}/${pad(day.day)}/${String(day.year).slice(2)}`}
    aria-label="Logged on"
  />
</div>
