<script module lang="ts">
  import { CalendarDate, type DateValue } from '@internationalized/date'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Calendar from './calendar.svelte'
  import RangeCalendar from './range-calendar.svelte'

  const { Story } = defineMeta({
    title: 'Forms/Calendar',
    component: Calendar,
    tags: ['shadcn'],
    parameters: { layout: 'centered' },
    argTypes: {
      captionLayout: {
        control: 'inline-radio',
        options: ['label', 'dropdown', 'dropdown-months', 'dropdown-years'],
      },
    },
  })

  // Fixed dates, so the screenshots do not drift with the day they are taken.
  const single = $state<{ value: DateValue | undefined }>({ value: new CalendarDate(2026, 3, 14) })
  const range = $state<{ value: { start: DateValue | undefined; end: DateValue | undefined } }>({
    value: { start: new CalendarDate(2026, 3, 9), end: new CalendarDate(2026, 3, 13) },
  })
  const far = $state<{ value: DateValue | undefined }>({ value: new CalendarDate(1990, 6, 2) })
</script>

<!--
  A single selectable date: the one a `DatePicker` renders inside its popover,
  and the one most call sites want.
-->
<Story name="Playground">
  {#snippet template(args)}
    <Calendar type="single" bind:value={single.value} captionLayout={args.captionLayout} />
  {/snippet}
</Story>

<!--
  `RangeCalendar`: a contiguous span, for reporting windows and stay lengths.
  The first click sets `start`; the second sets `end` and closes the span.
-->
<Story name="With range" asChild>
  <RangeCalendar bind:value={range.value} />
</Story>

<!--
  The caption as month and year selects, for a date far from the one in view:
  a birth date, an expiry.
-->
<Story name="Caption dropdowns" asChild>
  <Calendar type="single" bind:value={far.value} captionLayout="dropdown" />
</Story>
