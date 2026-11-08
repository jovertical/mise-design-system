<script lang="ts">
  import { ToggleGroup, ToggleGroupItem } from '../../src/lib/index.js'

  let { value = $bindable<string[]>(['counter']) }: { value?: string[] } = $props()
</script>

<ToggleGroup type="multiple" variant="outline" bind:value aria-label="Channels">
  <ToggleGroupItem value="counter">Counter</ToggleGroupItem>
  <ToggleGroupItem value="online">Online</ToggleGroupItem>
</ToggleGroup>
<output data-testid="value">{value.join(',')}</output>
