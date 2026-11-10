<!--
  Origin: the React package 2.23.0 `calendar.tsx` (`Calendar`, `mode="range"`), itself shadcn/ui new-york `calendar`
  Svelte: shadcn-svelte `range-calendar`
  Diverged: React's Calendar with `mode="range"` is its own component here, on
    bits-ui RangeCalendar, because its value is a `DateRange` (`{ start, end }`
    of `@internationalized/date` dates) rather than a day (round 7 plan, R7-1,
    R7-2). It shares Calendar's class map, so the two cannot drift. The range's
    span is `bg-muted`, where React used the brand-tinted `bg-accent`. Tabler's
    chevrons for Lucide's.
-->
<script lang="ts" module>
  import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui'

  import type { WithoutChildrenOrChild } from '../../../utils/types.js'
  import type { CalendarCaptionLayout } from './calendar-classes.js'

  /**
   * A contiguous span of days, for reporting windows and stay lengths. The
   * first click sets `start`; the second sets `end` and closes the span.
   */
  export type RangeCalendarProps = WithoutChildrenOrChild<RangeCalendarPrimitive.RootProps> & {
    /**
     * `label` names the month; the dropdown layouts swap the month, the year or
     * both for a native select, for a date far from today (a birth date, an
     * expiry).
     */
    captionLayout?: CalendarCaptionLayout
  }
</script>

<script lang="ts">
  import IconChevronLeft from '@tabler/icons-svelte-runes/icons/chevron-left'
  import IconChevronRight from '@tabler/icons-svelte-runes/icons/chevron-right'

  import { cn } from '../../../utils/cn.js'
  import CalendarCaption from './calendar-caption.svelte'
  import { CALENDAR_CLASS } from './calendar-classes.js'

  let {
    ref = $bindable(null),
    value = $bindable(),
    placeholder = $bindable(),
    captionLayout = 'label',
    locale = 'en-US',
    weekdayFormat = 'short',
    class: className,
    ...rest
  }: RangeCalendarProps = $props()
</script>

<RangeCalendarPrimitive.Root
  bind:ref
  bind:value
  bind:placeholder
  {locale}
  {weekdayFormat}
  data-slot="range-calendar"
  class={cn(CALENDAR_CLASS.root, className)}
  {...rest}
>
  {#snippet children({ months, weekdays })}
    <div class={CALENDAR_CLASS.months}>
      <nav class={CALENDAR_CLASS.nav}>
        <RangeCalendarPrimitive.PrevButton class={CALENDAR_CLASS.navButton}>
          <IconChevronLeft class="size-4" />
        </RangeCalendarPrimitive.PrevButton>
        <RangeCalendarPrimitive.NextButton class={CALENDAR_CLASS.navButton}>
          <IconChevronRight class="size-4" />
        </RangeCalendarPrimitive.NextButton>
      </nav>
      {#each months as month, monthIndex (month)}
        <div class={CALENDAR_CLASS.month}>
          <RangeCalendarPrimitive.Header class={CALENDAR_CLASS.header}>
            <CalendarCaption
              primitive={RangeCalendarPrimitive}
              layout={captionLayout}
              month={month.value}
              {monthIndex}
              {locale}
              bind:placeholder
            />
          </RangeCalendarPrimitive.Header>
          <RangeCalendarPrimitive.Grid class={CALENDAR_CLASS.grid}>
            <RangeCalendarPrimitive.GridHead>
              <RangeCalendarPrimitive.GridRow class={CALENDAR_CLASS.weekdays}>
                {#each weekdays as weekday, index (index)}
                  <RangeCalendarPrimitive.HeadCell class={CALENDAR_CLASS.weekday}>
                    {weekday.slice(0, 2)}
                  </RangeCalendarPrimitive.HeadCell>
                {/each}
              </RangeCalendarPrimitive.GridRow>
            </RangeCalendarPrimitive.GridHead>
            <RangeCalendarPrimitive.GridBody>
              {#each month.weeks as week (week)}
                <RangeCalendarPrimitive.GridRow class={CALENDAR_CLASS.week}>
                  {#each week as date (date)}
                    <RangeCalendarPrimitive.Cell
                      {date}
                      month={month.value}
                      class={cn(CALENDAR_CLASS.cell, CALENDAR_CLASS.rangeCell)}
                    >
                      <RangeCalendarPrimitive.Day
                        class={cn(CALENDAR_CLASS.day, CALENDAR_CLASS.rangeDay)}
                      />
                    </RangeCalendarPrimitive.Cell>
                  {/each}
                </RangeCalendarPrimitive.GridRow>
              {/each}
            </RangeCalendarPrimitive.GridBody>
          </RangeCalendarPrimitive.Grid>
        </div>
      {/each}
    </div>
  {/snippet}
</RangeCalendarPrimitive.Root>
