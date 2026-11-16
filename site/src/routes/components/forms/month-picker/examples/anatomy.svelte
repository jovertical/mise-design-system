<!-- Open on the page, for the anatomy, through `contentProps`, as on the DatePicker page. -->
<script lang="ts">
  import { CalendarDate } from '@internationalized/date'
  import { MonthPicker } from '@jovertical/mise-design-system'

  const contentProps = {
    portalProps: { disabled: true },
    onOpenAutoFocus: (event: Event) => event.preventDefault(),
    trapFocus: false,
    interactOutsideBehavior: 'ignore' as const,
    escapeKeydownBehavior: 'ignore' as const,
  }
</script>

<div class="h-80 w-64">
  <MonthPicker open value={new CalendarDate(2026, 3, 1)} {contentProps} aria-label="Report month" />
</div>
