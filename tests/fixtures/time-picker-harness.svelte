<script lang="ts">
  import type { Time } from '@internationalized/date'

  import { TimePicker } from '../../src/lib/index.js'

  let {
    value = $bindable<Time | undefined>(undefined),
    disabled = false,
  }: {
    value?: Time
    disabled?: boolean
  } = $props()
</script>

<TimePicker bind:value {disabled} />
<output data-testid="value">{value?.toString() ?? ''}</output>
