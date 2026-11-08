<script lang="ts">
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../src/lib/index.js'

  let { open = $bindable(false) }: { open?: boolean } = $props()
</script>

<Collapsible bind:open>
  <CollapsibleTrigger>Show details</CollapsibleTrigger>
  <CollapsibleContent>North depot holds 398 units.</CollapsibleContent>
</Collapsible>
<output data-testid="open">{open ? 'open' : 'closed'}</output>
