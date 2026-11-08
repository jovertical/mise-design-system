<script lang="ts">
  import { CalendarDate, type DateValue } from '@internationalized/date'
  import type { DateRange } from 'bits-ui'

  import { DatePicker } from '../../src/lib/index.js'

  let {
    mode = 'single',
    disabled = false,
    floor = false,
  }: { mode?: 'single' | 'range'; disabled?: boolean; floor?: boolean } = $props()

  let day = $state<DateValue | undefined>(new CalendarDate(2026, 3, 14))
  let range = $state<DateRange | undefined>({ start: new CalendarDate(2026, 3, 2), end: undefined })
  const minValue = $derived(floor ? new CalendarDate(2026, 3, 10) : undefined)
</script>

{#if mode === 'single'}
  <DatePicker mode="single" bind:value={day} {disabled} {minValue} />
  <output data-testid="value">{day?.toString() ?? ''}</output>
{:else}
  <DatePicker mode="range" bind:value={range} {disabled} {minValue} />
  <output data-testid="value"
    >{range?.start?.toString() ?? ''}..{range?.end?.toString() ?? ''}</output
  >
{/if}
