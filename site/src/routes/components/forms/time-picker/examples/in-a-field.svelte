<!--
  The label's `for` names the picker's `id`, which sits on the hour select,
  so clicking the label focuses it. `aria-invalid` borders the hour select.
-->
<script lang="ts">
  import { Time } from '@internationalized/date'
  import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    TimePicker,
  } from '@jovertical/mise-design-system'

  let value: Time | undefined = $state(new Time(7, 0))
</script>

<Field class="max-w-xs" data-invalid="true">
  <FieldLabel for="day-rollover">Day rolls over at</FieldLabel>
  <TimePicker id="day-rollover" hourCycle={24} aria-invalid="true" bind:value />
  <FieldDescription>Sales after this time count toward the next day.</FieldDescription>
  <FieldError errors={[{ message: 'Pick a time before 06:00.' }]} />
</Field>
