<script module lang="ts">
  import { CalendarDate } from '@internationalized/date'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import Field from '../field/field.svelte'
  import FieldLabel from '../field/field-label.svelte'
  import Select from '../select/select.svelte'
  import SelectContent from '../select/select-content.svelte'
  import SelectItem from '../select/select-item.svelte'
  import SelectTrigger from '../select/select-trigger.svelte'
  import SelectValue from '../select/select-value.svelte'
  import MonthPicker from './month-picker.svelte'

  const { Story } = defineMeta({
    title: 'Forms/MonthPicker',
    component: MonthPicker,
    tags: ['mise'],
    parameters: { layout: 'centered' },
  })

  const playground = $state<{ value: CalendarDate | undefined }>({
    value: new CalendarDate(2026, 3, 1),
  })

  const bounded = $state<{ value: CalendarDate | undefined }>({
    value: new CalendarDate(2026, 3, 1),
  })

  const report = $state<{ value: CalendarDate | undefined }>({
    value: new CalendarDate(2026, 10, 1),
  })

  const SITES = [
    { value: 'all', label: 'All sites' },
    { value: 'north', label: 'North depot' },
    { value: 'south', label: 'South depot' },
  ]

  let site = $state('all')
</script>

<!-- A month and its year: the value is always the month's first day. -->
<Story name="Playground">
  {#snippet template()}
    <div class="w-64"><MonthPicker bind:value={playground.value} /></div>
  {/snippet}
</Story>

<!-- Empty until the operator picks; disabled; invalid, its border on the trigger. -->
<Story name="States" asChild>
  <StoryAxis values={['empty', 'disabled', 'invalid'] as const} orientation="vertical">
    {#snippet item(state)}
      <div class="w-64">
        {#if state === 'empty'}
          <MonthPicker />
        {:else if state === 'disabled'}
          <MonthPicker disabled value={new CalendarDate(2026, 3, 1)} />
        {:else}
          <MonthPicker aria-invalid="true" value={new CalendarDate(2026, 3, 1)} />
        {/if}
      </div>
    {/snippet}
  </StoryAxis>
</Story>

<!--
  `minValue` and `maxValue` bound it by month: here November 2025 to April
  2026, the months a ledger has. The year arrows stop at the ends.
-->
<Story name="With bounds" asChild>
  <div class="w-64">
    <MonthPicker
      bind:value={bounded.value}
      minValue={new CalendarDate(2025, 11, 1)}
      maxValue={new CalendarDate(2026, 4, 1)}
    />
  </div>
</Story>

<!-- The filter row a monthly report has: a site and a month, side by side. -->
<Story name="In a toolbar" asChild>
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
      <MonthPicker id="report-month" bind:value={report.value} />
    </Field>
  </div>
</Story>
