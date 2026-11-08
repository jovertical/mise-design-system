<!--
  Origin: the React package 2.23.0 `calendar.tsx` (`Calendar`, `mode="single"`), itself shadcn/ui new-york `calendar`
  Svelte: shadcn-svelte `calendar`
  Diverged: bits-ui Calendar for react-day-picker, with `bind:value` and
    `bind:placeholder` (the month in view). Values are `@internationalized/date`
    dates, not JS `Date`s (round 7 plan, R7-1). React's `mode="range"` is
    RangeCalendar (R7-2). React's `classNames` and `components` override maps
    have no counterpart, and the parts are not exported: React exported only
    Calendar and its day button. React's `disabled` matcher is bits-ui's
    `isDateDisabled`, with `minValue` and `maxValue` (R7-3). Lucide icons from
    `@lucide/svelte`.
-->
<script lang="ts" module>
  import { Calendar as CalendarPrimitive } from 'bits-ui'

  import type { WithoutChildrenOrChild } from '../../../utils/types.js'
  import type { CalendarCaptionLayout } from './calendar-classes.js'

  /**
   * A month grid to pick a day from. The one a `DatePicker` renders inside its
   * popover, and the one most call sites want; `type="multiple"` picks several
   * separate days, and `RangeCalendar` a contiguous span.
   *
   * Outside days show by default, so a week is never ragged.
   */
  export type CalendarProps = WithoutChildrenOrChild<CalendarPrimitive.RootProps> & {
    /**
     * `label` names the month; the dropdown layouts swap the month, the year or
     * both for a native select, for a date far from today (a birth date, an
     * expiry).
     */
    captionLayout?: CalendarCaptionLayout
  }
</script>

<script lang="ts">
  import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left'
  import ChevronRightIcon from '@lucide/svelte/icons/chevron-right'

  import { cn } from '../../../utils/cn.js'
  import CalendarCaption from './calendar-caption.svelte'
  import { CALENDAR_CLASS } from './calendar-classes.js'

  let {
    ref = $bindable(null),
    value = $bindable(),
    placeholder = $bindable(),
    type = 'single',
    captionLayout = 'label',
    locale = 'en-US',
    weekdayFormat = 'short',
    class: className,
    ...rest
  }: CalendarProps = $props()
</script>

<!-- bits-ui's single and multiple roots are a discriminated union, which a
     bound, destructured `value` cannot satisfy; cast as shadcn-svelte does. -->
<CalendarPrimitive.Root
  bind:ref
  bind:value={value as never}
  bind:placeholder
  type={type as never}
  {locale}
  {weekdayFormat}
  data-slot="calendar"
  class={cn(CALENDAR_CLASS.root, className)}
  {...rest}
>
  {#snippet children({ months, weekdays })}
    <div class={CALENDAR_CLASS.months}>
      <nav class={CALENDAR_CLASS.nav}>
        <CalendarPrimitive.PrevButton class={CALENDAR_CLASS.navButton}>
          <ChevronLeftIcon class="size-4" />
        </CalendarPrimitive.PrevButton>
        <CalendarPrimitive.NextButton class={CALENDAR_CLASS.navButton}>
          <ChevronRightIcon class="size-4" />
        </CalendarPrimitive.NextButton>
      </nav>
      {#each months as month, monthIndex (month)}
        <div class={CALENDAR_CLASS.month}>
          <CalendarPrimitive.Header class={CALENDAR_CLASS.header}>
            <CalendarCaption
              primitive={CalendarPrimitive}
              layout={captionLayout}
              month={month.value}
              {monthIndex}
              {locale}
              bind:placeholder
            />
          </CalendarPrimitive.Header>
          <CalendarPrimitive.Grid class={CALENDAR_CLASS.grid}>
            <CalendarPrimitive.GridHead>
              <CalendarPrimitive.GridRow class={CALENDAR_CLASS.weekdays}>
                {#each weekdays as weekday, index (index)}
                  <CalendarPrimitive.HeadCell class={CALENDAR_CLASS.weekday}>
                    {weekday.slice(0, 2)}
                  </CalendarPrimitive.HeadCell>
                {/each}
              </CalendarPrimitive.GridRow>
            </CalendarPrimitive.GridHead>
            <CalendarPrimitive.GridBody>
              {#each month.weeks as week (week)}
                <CalendarPrimitive.GridRow class={CALENDAR_CLASS.week}>
                  {#each week as date (date)}
                    <CalendarPrimitive.Cell {date} month={month.value} class={CALENDAR_CLASS.cell}>
                      <CalendarPrimitive.Day
                        class={cn(CALENDAR_CLASS.day, CALENDAR_CLASS.singleDay)}
                      />
                    </CalendarPrimitive.Cell>
                  {/each}
                </CalendarPrimitive.GridRow>
              {/each}
            </CalendarPrimitive.GridBody>
          </CalendarPrimitive.Grid>
        </div>
      {/each}
    </div>
  {/snippet}
</CalendarPrimitive.Root>
