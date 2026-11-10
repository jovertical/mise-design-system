<script lang="ts">
  import { CalendarDate, type DateValue } from '@internationalized/date'

  import { Calendar, type CalendarCaptionLayout } from '../../src/lib/index.js'

  let {
    value = $bindable<DateValue | undefined>(undefined),
    disableWeekends = false,
    minValue,
    captionLayout,
  }: {
    value?: DateValue
    disableWeekends?: boolean
    minValue?: DateValue
    captionLayout?: CalendarCaptionLayout
  } = $props()

  const placeholder = new CalendarDate(2026, 3, 14)

  const isWeekend = (date: DateValue) => {
    const day = date.toDate('UTC').getUTCDay()

    return day === 0 || day === 6
  }
</script>

<Calendar
  type="single"
  bind:value
  {placeholder}
  {minValue}
  {captionLayout}
  isDateDisabled={disableWeekends ? isWeekend : undefined}
/>
<output data-testid="value">{value?.toString() ?? ''}</output>
