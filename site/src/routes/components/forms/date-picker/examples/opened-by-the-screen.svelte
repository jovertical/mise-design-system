<!--
  The screen opens the calendar itself through `bind:open`: a "Reschedule"
  action beside the field, as a row action or a shortcut would.
-->
<script lang="ts">
  import { CalendarDate, type DateValue } from '@internationalized/date'
  import { Button, DatePicker } from '@jovertical/mise-design-system'

  let delivery: DateValue | undefined = $state(new CalendarDate(2026, 3, 14))
  let open = $state(false)
</script>

<div class="flex w-96 items-center gap-3">
  <DatePicker mode="single" bind:value={delivery} bind:open aria-label="Delivery" />
  <Button variant="outline" onclick={() => (open = true)}>Reschedule</Button>
</div>
