<!--
  A label for a control that cannot carry one: an icon button, a truncated
  cell, a disabled action that owes an explanation. Keep it to a phrase.
-->
<script lang="ts">
  import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@jovertical/mise-design-system'
  import IconRefresh from '@tabler/icons-svelte-runes/icons/refresh'
</script>

<Tooltip>
  <TooltipTrigger>
    {#snippet child({ props })}
      <Button variant="outline" iconOnly aria-label="Regenerate the pairing code" {...props}>
        <IconRefresh />
      </Button>
    {/snippet}
  </TooltipTrigger>
  <TooltipContent>Regenerate the pairing code</TooltipContent>
</Tooltip>
