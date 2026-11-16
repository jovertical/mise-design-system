<!--
  `clearable={false}` for a count where zero is a real answer and blank is
  not: an emptied field commits `min` on blur. The default keeps a blank as
  null, for a lead time that may go unanswered. A negative `min` lets a minus
  sign be typed, for a stock adjustment.
-->
<script lang="ts">
  import { NumberInput } from '@jovertical/mise-design-system'

  let seats: number | null = $state(2)
  let leadTime: number | null = $state(null)
  let adjustment: number | null = $state(-3)
</script>

<NumberInput aria-label="Seats" format="integer" controls clearable={false} bind:value={seats} />
<NumberInput aria-label="Lead time in days" format="integer" controls bind:value={leadTime} />
<NumberInput class="w-36" aria-label="Adjustment" min={-100} bind:value={adjustment} />
