<!--
  Origin: mise
  Diverged: none. MonthPicker has no React original; mise authored it for
    bertos-bakery-ops' monthly reports and ledgers (2026-11-10), where
    DatePicker could only pick a day.
-->
<script lang="ts" module>
  import type { CalendarDate, DateValue } from '@internationalized/date'
  import type { HTMLAttributes } from 'svelte/elements'

  /**
   * A month and its year behind a trigger, for a report or a ledger filtered by
   * month: the year with its arrows over a grid of the twelve months.
   *
   * The value is a `CalendarDate` on the month's first day: a picked month
   * always reports day 1, and the day of a value passed in is ignored. Months
   * outside `minValue` and `maxValue` cannot be picked, compared by month.
   * `id` and the other attributes land on the trigger, which is filled like
   * `Input`, so it sits in a `Field` or a filter row.
   */
  export type MonthPickerProps = Omit<
    HTMLAttributes<HTMLElement>,
    'children' | 'placeholder' | 'aria-invalid' | 'class'
  > & {
    value?: CalendarDate
    onValueChange?: (value: CalendarDate) => void
    minValue?: DateValue
    maxValue?: DateValue
    /** The trigger's text for a picked month. "March 2026" in `locale` by default. */
    formatLabel?: (value: CalendarDate) => string
    /** For the month names and the default label. `en-US` when absent. */
    locale?: string
    placeholder?: string
    disabled?: boolean
    'aria-invalid'?: HTMLAttributes<HTMLElement>['aria-invalid']
    class?: string
  }
</script>

<script lang="ts">
  import { getLocalTimeZone, today } from '@internationalized/date'
  import IconCalendarMonth from '@tabler/icons-svelte-runes/icons/calendar-month'

  import { cn } from '../../../utils/cn.js'
  import Button from '../../actions/button/button.svelte'
  import Popover from '../../overlays/popover/popover.svelte'
  import PopoverContent from '../../overlays/popover/popover-content.svelte'
  import PopoverTrigger from '../../overlays/popover/popover-trigger.svelte'
  import MonthPickerGrid from './month-picker-grid.svelte'
  import { firstOfMonth, longMonthLabel } from './month-picker-months.js'

  let {
    value = $bindable(),
    onValueChange,
    minValue,
    maxValue,
    formatLabel,
    locale = 'en-US',
    placeholder = 'Pick a month',
    disabled = false,
    'aria-invalid': ariaInvalid,
    id,
    class: className,
    ...rest
  }: MonthPickerProps = $props()

  let open = $state(false)
  let shownYear = $state(today(getLocalTimeZone()).year)

  const label = $derived.by(() => {
    if (!value) return null

    return formatLabel ? formatLabel(value) : longMonthLabel(value, locale)
  })

  // Each time it opens, the popover starts on the value's year.
  $effect(() => {
    if (open && value) shownYear = value.year
  })

  function pick(year: number, month: number) {
    const next = firstOfMonth(year, month)

    value = next

    onValueChange?.(next)

    open = false
  }
</script>

<Popover bind:open>
  <PopoverTrigger {disabled} id={id ?? undefined}>
    {#snippet child({ props })}
      <Button
        {...rest}
        {...props}
        variant="ghost"
        {disabled}
        aria-invalid={ariaInvalid}
        data-slot="month-picker-trigger"
        data-placeholder={label ? undefined : ''}
        class={cn(
          'bg-input/50 hover:bg-input data-[placeholder]:text-muted-foreground w-full justify-start rounded-2xl border-transparent font-normal shadow-xs',
          className,
        )}
      >
        <IconCalendarMonth />
        {label ?? placeholder}
      </Button>
    {/snippet}
  </PopoverTrigger>
  <PopoverContent class="w-auto p-0">
    <MonthPickerGrid
      year={shownYear}
      selected={value}
      {minValue}
      {maxValue}
      {locale}
      onYearChange={(year) => (shownYear = year)}
      onPick={pick}
    />
  </PopoverContent>
</Popover>
