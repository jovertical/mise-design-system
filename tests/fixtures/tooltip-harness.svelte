<script lang="ts">
  import { Button, Tooltip, TooltipContent, TooltipTrigger } from '../../src/lib/index.js'

  let { open = $bindable(false) }: { open?: boolean } = $props()
</script>

<Tooltip bind:open>
  <TooltipTrigger>
    {#snippet child({ props })}
      <Button variant="outline" {...props}>Regenerate</Button>
    {/snippet}
  </TooltipTrigger>
  <TooltipContent>Regenerate the pairing code</TooltipContent>
</Tooltip>
<output data-testid="open">{open ? 'open' : 'closed'}</output>
