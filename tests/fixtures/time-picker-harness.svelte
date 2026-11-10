<script lang="ts">
  import type { Time } from '@internationalized/date'

  import { FieldLabel, TimePicker } from '../../src/lib/index.js'

  let {
    value = $bindable<Time | undefined>(undefined),
    disabled = false,
    hourCycle,
    minuteStep,
    invalid = false,
  }: {
    value?: Time
    disabled?: boolean
    hourCycle?: 12 | 24
    minuteStep?: number
    invalid?: boolean
  } = $props()
</script>

<FieldLabel for="rollover">Rolls over at</FieldLabel>
<TimePicker
  id="rollover"
  bind:value
  {disabled}
  {hourCycle}
  {minuteStep}
  aria-invalid={invalid ? 'true' : undefined}
/>
<output data-testid="value">{value?.toString() ?? ''}</output>
