<script lang="ts">
  import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../src/lib/index.js'

  let { open = $bindable(false) }: { open?: boolean } = $props()
</script>

<HoverCard bind:open openDelay={0}>
  <HoverCardTrigger href="#person">Dana Reyes</HoverCardTrigger>
  <HoverCardContent>Shift lead, North depot</HoverCardContent>
</HoverCard>
<output data-testid="open">{open ? 'open' : 'closed'}</output>
