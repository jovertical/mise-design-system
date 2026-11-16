<!-- The caption as month and year selects, for a date far from the one in view: a licence expiry. -->
<script lang="ts">
  import { CalendarDate, type DateValue } from '@internationalized/date'
  import { Calendar } from '@jovertical/mise-design-system'

  let value: DateValue | undefined = $state(new CalendarDate(2029, 6, 2))
</script>

<Calendar type="single" bind:value captionLayout="dropdown" />
