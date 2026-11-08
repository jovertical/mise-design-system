<!--
  Origin: the React package 2.23.0 `date-picker.tsx`
  Diverged: values are `@internationalized/date` dates, and a range is bits-ui's
    `{ start, end }` for react-day-picker's `{ from, to }` (round 7 plan, R7-1);
    `value` is bindable, with `onValueChange` for React's `onChange`. React's
    `disabledDates` matcher is `isDateDisabled`, with `minValue` and `maxValue`
    (R7-3). The label is `DateFormatter` with `dateStyle: 'long'` in `locale`,
    for date-fns' `PPP`. Lucide's calendar from `@lucide/svelte`.
-->
<script lang="ts" module>
  import type { DateValue } from '@internationalized/date'
  import type { DateRange } from 'bits-ui'

  type Single = {
    mode: 'single'
    value?: DateValue
    onValueChange?: (value: DateValue | undefined) => void
  }
  type Range = {
    mode: 'range'
    value?: DateRange
    onValueChange?: (value: DateRange | undefined) => void
  }

  /**
   * A `Calendar` behind a trigger, for the case where the calendar itself
   * would otherwise sit permanently on the page.
   *
   * `mode` is not optional and there is no default: a single date and a range
   * are different value shapes, and picking one silently would make the wrong
   * value type a runtime surprise instead of a compile error.
   *
   * The trigger is `w-full`, matching `SelectTrigger`. Selecting a single date
   * closes the popover; a range stays open until both ends are picked, so the
   * operator can see the selection in progress.
   */
  export type DatePickerProps = (Single | Range) & {
    placeholder?: string
    /** Disables the whole control: the trigger cannot be opened. */
    disabled?: boolean
    /** Marks the trigger invalid; `Button` draws the destructive border `Input` does. */
    'aria-invalid'?: boolean
    /**
     * Days the operator may not pick, inside an open calendar. Distinct from
     * `disabled`, which closes the control. The rule is the caller's, not a
     * `disablePast` flag: what counts as "past" is a decision the screen owns.
     */
    isDateDisabled?: (date: DateValue) => boolean
    minValue?: DateValue
    maxValue?: DateValue
    /** For the trigger's label and the calendar. `en-US` when absent. */
    locale?: string
    class?: string
  }

  const DEFAULT_PLACEHOLDER = { single: 'Pick a date', range: 'Pick a date range' } as const
</script>

<script lang="ts">
  import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
  import CalendarIcon from '@lucide/svelte/icons/calendar'

  import { cn } from '../../../utils/cn.js'
  import Button from '../../actions/button/button.svelte'
  import Popover from '../../overlays/popover/popover.svelte'
  import PopoverContent from '../../overlays/popover/popover-content.svelte'
  import PopoverTrigger from '../../overlays/popover/popover-trigger.svelte'
  import Calendar from '../calendar/calendar.svelte'
  import RangeCalendar from '../calendar/range-calendar.svelte'

  let {
    mode,
    value = $bindable(),
    onValueChange,
    placeholder,
    disabled = false,
    'aria-invalid': ariaInvalid,
    isDateDisabled,
    minValue,
    maxValue,
    locale = 'en-US',
    class: className,
  }: DatePickerProps = $props()

  let open = $state(false)

  const formatter = $derived(new DateFormatter(locale, { dateStyle: 'long' }))
  const formatDate = (date: DateValue) => formatter.format(date.toDate(getLocalTimeZone()))

  const label = $derived.by(() => {
    if (mode === 'single') return value ? formatDate(value as DateValue) : null
    const range = value as DateRange | undefined
    if (!range?.start) return null
    if (!range.end) return formatDate(range.start)
    return `${formatDate(range.start)} – ${formatDate(range.end)}`
  })

  function pickDay(next: DateValue | undefined) {
    value = next
    ;(onValueChange as Single['onValueChange'])?.(next)
    open = false
  }

  function pickRange(next: DateRange) {
    value = next
    ;(onValueChange as Range['onValueChange'])?.(next)
    if (next.start && next.end) open = false
  }
</script>

<Popover bind:open>
  <PopoverTrigger {disabled}>
    {#snippet child({ props })}
      <Button
        {...props}
        variant="outline"
        {disabled}
        aria-invalid={ariaInvalid}
        data-slot="date-picker-trigger"
        class={cn('w-full justify-start font-normal', className)}
      >
        <CalendarIcon />
        {label ?? placeholder ?? DEFAULT_PLACEHOLDER[mode]}
      </Button>
    {/snippet}
  </PopoverTrigger>
  <PopoverContent class="w-auto p-0">
    {#if mode === 'single'}
      <Calendar
        type="single"
        value={value as DateValue | undefined}
        onValueChange={pickDay}
        {isDateDisabled}
        {minValue}
        {maxValue}
        {locale}
      />
    {:else}
      <RangeCalendar
        value={value as DateRange | undefined}
        onValueChange={pickRange}
        {isDateDisabled}
        {minValue}
        {maxValue}
        {locale}
      />
    {/if}
  </PopoverContent>
</Popover>
