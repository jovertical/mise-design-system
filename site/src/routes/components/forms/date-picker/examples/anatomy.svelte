<!--
  Open on the page, for the anatomy: `contentProps` keeps the calendar out of
  a portal and lifts the popover's hold on the page (focus taken on open, a
  focus trap, closing on Escape or an outside click).
-->
<script lang="ts">
  import { CalendarDate } from '@internationalized/date'
  import { DatePicker } from '@jovertical/mise-design-system'

  const contentProps = {
    portalProps: { disabled: true },
    onOpenAutoFocus: (event: Event) => event.preventDefault(),
    trapFocus: false,
    interactOutsideBehavior: 'ignore' as const,
    escapeKeydownBehavior: 'ignore' as const,
  }
</script>

<div class="h-[26rem] w-72">
  <DatePicker
    mode="single"
    open
    value={new CalendarDate(2026, 3, 14)}
    {contentProps}
    aria-label="Ships on"
  />
</div>
