<!--
  Origin: the React package 2.23.0 `calendar.tsx` (`caption_label`, `dropdowns`)
  Svelte: shadcn-svelte `calendar`
  Diverged: the caption as its own part, drawn for Calendar and RangeCalendar
    alike from whichever bits-ui primitive renders it. Not exported. The
    dropdowns are bits-ui's MonthSelect and YearSelect behind React's invisible
    native select, as react-day-picker drew them. Lucide's chevron-down.
-->
<script lang="ts" module>
  import type { DateValue } from '@internationalized/date'
  import type {
    Calendar as CalendarPrimitive,
    RangeCalendar as RangeCalendarPrimitive,
  } from 'bits-ui'

  import type { CalendarCaptionLayout } from './calendar-classes.js'

  export type CalendarCaptionProps = {
    primitive: typeof CalendarPrimitive | typeof RangeCalendarPrimitive
    layout: CalendarCaptionLayout
    /** The month this caption heads. */
    month: DateValue
    /** Which of the visible months it is, so a month pick moves the first one. */
    monthIndex: number
    locale: string
    placeholder?: DateValue
  }
</script>

<script lang="ts">
  import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down'

  import { CALENDAR_CLASS } from './calendar-classes.js'

  let {
    primitive,
    layout,
    month,
    monthIndex,
    locale,
    placeholder = $bindable(),
  }: CalendarCaptionProps = $props()

  const format = (date: DateValue, options: Intl.DateTimeFormatOptions) =>
    new DateFormatter(locale, options).format(date.toDate(getLocalTimeZone()))

  const showMonths = $derived(layout === 'dropdown' || layout === 'dropdown-months')
  const showYears = $derived(layout === 'dropdown' || layout === 'dropdown-years')

  function pickMonth(event: Event & { currentTarget: HTMLSelectElement }) {
    if (!placeholder) return
    const picked = placeholder.set({ month: Number.parseInt(event.currentTarget.value, 10) })
    placeholder = picked.subtract({ months: monthIndex })
  }
</script>

{#if layout === 'label'}
  <span class={CALENDAR_CLASS.captionLabel}
    >{format(month, { month: 'long', year: 'numeric' })}</span
  >
{:else}
  <div class={CALENDAR_CLASS.dropdowns}>
    {#if showMonths}
      <span class={CALENDAR_CLASS.dropdownRoot}>
        <primitive.MonthSelect monthFormat="short" class={CALENDAR_CLASS.dropdown}>
          {#snippet child({ props, monthItems })}
            <select {...props} value={month.month} onchange={pickMonth}>
              {#each monthItems as item (item.value)}
                <option value={item.value}>{item.label}</option>
              {/each}
            </select>
            <span class={CALENDAR_CLASS.dropdownLabel} aria-hidden="true">
              {format(month, { month: 'short' })}
              <ChevronDownIcon />
            </span>
          {/snippet}
        </primitive.MonthSelect>
      </span>
    {:else}
      <span class={CALENDAR_CLASS.captionLabel}>{format(month, { month: 'long' })}</span>
    {/if}
    {#if showYears}
      <span class={CALENDAR_CLASS.dropdownRoot}>
        <primitive.YearSelect class={CALENDAR_CLASS.dropdown}>
          {#snippet child({ props, yearItems })}
            <select {...props} value={month.year}>
              {#each yearItems as item (item.value)}
                <option value={item.value}>{item.label}</option>
              {/each}
            </select>
            <span class={CALENDAR_CLASS.dropdownLabel} aria-hidden="true">
              {month.year}
              <ChevronDownIcon />
            </span>
          {/snippet}
        </primitive.YearSelect>
      </span>
    {:else}
      <span class={CALENDAR_CLASS.captionLabel}>{month.year}</span>
    {/if}
  </div>
{/if}
