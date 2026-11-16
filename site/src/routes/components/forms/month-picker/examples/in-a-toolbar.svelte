<!-- The filter row a monthly report has: a site and a month, side by side. -->
<script lang="ts">
  import { CalendarDate } from '@internationalized/date'
  import {
    Field,
    FieldLabel,
    MonthPicker,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@jovertical/mise-design-system'

  const SITES = [
    { value: 'all', label: 'All sites' },
    { value: 'north', label: 'North depot' },
    { value: 'south', label: 'South depot' },
  ]

  let site = $state('all')
  let month: CalendarDate | undefined = $state(new CalendarDate(2026, 10, 1))
</script>

<div class="flex w-[32rem] items-end gap-3">
  <Field class="flex-1">
    <FieldLabel for="report-site">Site</FieldLabel>
    <Select type="single" bind:value={site} items={SITES}>
      <SelectTrigger id="report-site"><SelectValue /></SelectTrigger>
      <SelectContent>
        {#each SITES as option (option.value)}
          <SelectItem value={option.value} label={option.label} />
        {/each}
      </SelectContent>
    </Select>
  </Field>
  <Field class="flex-1">
    <FieldLabel for="report-month">Month</FieldLabel>
    <MonthPicker id="report-month" bind:value={month} />
  </Field>
</div>
