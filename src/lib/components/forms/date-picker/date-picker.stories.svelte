<script module lang="ts">
  import { CalendarDate, type DateValue } from '@internationalized/date'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import type { DateRange } from 'bits-ui'

  import DatePicker from './date-picker.svelte'

  const { Story } = defineMeta({
    title: 'Forms/DatePicker',
    component: DatePicker,
    tags: ['mise'],
    parameters: { layout: 'centered' },
  })

  const single = $state<{ value: DateValue | undefined }>({ value: undefined })
  const range = $state<{ value: DateRange | undefined }>({ value: undefined })
  // A fixed "today", so the story does not drift with the day it is opened.
  const TODAY = new CalendarDate(2026, 3, 14)
  const future = $state<{ value: DateRange | undefined }>({
    value: { start: TODAY, end: undefined },
  })
</script>

<!-- The single-date case: a trigger showing the chosen date, or a placeholder. -->
<Story name="Playground">
  {#snippet template()}
    <div class="w-64"><DatePicker mode="single" bind:value={single.value} /></div>
  {/snippet}
</Story>

<!-- A disabled trigger, for a field the operator cannot edit yet; and an invalid one. -->
<Story name="States" asChild>
  <div class="flex w-64 flex-col gap-3">
    <DatePicker mode="single" disabled placeholder="Disabled" />
    <DatePicker mode="single" aria-invalid placeholder="Invalid" />
  </div>
</Story>

<!--
  A start-to-end span. The trigger shows the start until the end is picked,
  then both, and the popover closes only once it has both ends.
-->
<Story name="With range" asChild>
  <div class="w-80"><DatePicker mode="range" bind:value={range.value} /></div>
</Story>

<!--
  `minValue` greys out the days before it inside an open calendar; not to be
  confused with `disabled`, which closes the whole control. The floor is the
  caller's, not a `disablePast` flag: a booking cannot start yesterday, but a
  discount being edited may have started last month, and its picker must still
  re-select that day. Here "today" is a fixed date.
-->
<Story name="Disabled past dates" asChild>
  <div class="w-80">
    <DatePicker mode="range" bind:value={future.value} minValue={TODAY} />
  </div>
</Story>
