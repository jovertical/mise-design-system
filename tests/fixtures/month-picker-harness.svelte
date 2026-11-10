<script lang="ts">
  import { CalendarDate } from '@internationalized/date'

  import { FieldLabel, MonthPicker } from '../../src/lib/index.js'

  let {
    empty = false,
    value = $bindable<CalendarDate | undefined>(empty ? undefined : new CalendarDate(2026, 3, 1)),
    bounded = false,
    formatLabel,
    invalid = false,
  }: {
    value?: CalendarDate
    bounded?: boolean
    formatLabel?: (value: CalendarDate) => string
    invalid?: boolean
    empty?: boolean
  } = $props()

  const minValue = $derived(bounded ? new CalendarDate(2025, 11, 1) : undefined)
  const maxValue = $derived(bounded ? new CalendarDate(2026, 4, 1) : undefined)
</script>

<FieldLabel for="report-month">Month</FieldLabel>
<MonthPicker
  id="report-month"
  bind:value
  {minValue}
  {maxValue}
  {formatLabel}
  aria-invalid={invalid ? 'true' : undefined}
/>
<output data-testid="value">{value?.toString() ?? ''}</output>
