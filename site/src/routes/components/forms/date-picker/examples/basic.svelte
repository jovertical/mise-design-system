<!-- In a Field: the trigger takes the field's id, so the label focuses it, and it is filled as an input is. -->
<script lang="ts">
  import type { DateValue } from '@internationalized/date'
  import { DatePicker, Field, FieldDescription, FieldLabel } from '@jovertical/mise-design-system'

  let shipsOn: DateValue | undefined = $state(undefined)
</script>

<Field class="w-full max-w-xs">
  <FieldLabel for="ships-on">Ships on</FieldLabel>
  <DatePicker id="ships-on" mode="single" bind:value={shipsOn} />
  <FieldDescription>The day it leaves the depot.</FieldDescription>
</Field>
