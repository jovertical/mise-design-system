<script lang="ts">
  import { CalendarDate } from '@internationalized/date'

  import DatePicker from '../../src/lib/components/forms/date-picker/date-picker.svelte'
  import MonthPicker from '../../src/lib/components/forms/month-picker/month-picker.svelte'

  let { picker = 'date' }: { picker?: 'date' | 'month' } = $props()

  let open = $state(true)
  let value = $state(new CalendarDate(2026, 3, 14))

  const inPlace = { portalProps: { disabled: true } }
</script>

<div data-testid="host">
  {#if picker === 'date'}
    <DatePicker mode="single" bind:value bind:open contentProps={inPlace} aria-label="Delivery" />
  {:else}
    <MonthPicker bind:value bind:open contentProps={inPlace} aria-label="Report month" />
  {/if}
</div>
<p data-testid="open">{open}</p>
