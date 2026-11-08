<script lang="ts">
  import {
    Button,
    Input,
    Label,
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from '../../src/lib/index.js'

  let {
    open = $bindable(false),
    matchTriggerWidth = false,
  }: { open?: boolean; matchTriggerWidth?: boolean } = $props()
</script>

<Popover bind:open>
  <PopoverTrigger>
    {#snippet child({ props })}
      <Button variant="outline" {...props}>Filters</Button>
    {/snippet}
  </PopoverTrigger>
  <PopoverContent {matchTriggerWidth}>
    <Label for="minimum">Minimum</Label>
    <Input id="minimum" placeholder="0" />
  </PopoverContent>
</Popover>
<output data-testid="open">{open ? 'open' : 'closed'}</output>
