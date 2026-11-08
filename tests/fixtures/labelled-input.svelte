<script lang="ts">
  import { Input, Label } from '../../src/lib/index.js'

  let { value = $bindable('') }: { value?: string } = $props()
</script>

<Label for="location-name">Location name</Label>
<Input id="location-name" placeholder="Riverside" bind:value />
<output data-testid="echo">{value}</output>
