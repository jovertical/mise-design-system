<script lang="ts">
  import { ToggleGroup, ToggleGroupItem } from '../../src/lib/index.js'

  let { value = $bindable('1') }: { value?: string } = $props()
</script>

<ToggleGroup type="single" variant="segmented" bind:value aria-label="Multiplier">
  <ToggleGroupItem value="1">1x</ToggleGroupItem>
  <ToggleGroupItem value="1.5">1.5x</ToggleGroupItem>
  <ToggleGroupItem value="2">2x</ToggleGroupItem>
</ToggleGroup>
<output data-testid="value">{value}</output>
