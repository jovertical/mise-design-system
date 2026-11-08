<script lang="ts">
  import { NumberInput, type NumberInputProps } from '../../src/lib/index.js'

  let {
    value = $bindable(null),
    ...rest
  }: Omit<NumberInputProps, 'value'> & { value?: number | null } = $props()
</script>

<NumberInput aria-label="Amount" bind:value {...rest} />
<button type="button">Elsewhere</button>
<output data-testid="value">{value === null ? 'null' : value}</output>
