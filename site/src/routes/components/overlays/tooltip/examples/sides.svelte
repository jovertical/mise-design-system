<!-- Every side; the arrow is a square pulled under the panel's edge, in the panel's colour. -->
<script lang="ts">
  import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@jovertical/mise-design-system'

  const SIDES = ['top', 'right', 'bottom', 'left'] as const
</script>

<div class="grid grid-cols-2 gap-6">
  {#each SIDES as side (side)}
    <Tooltip>
      <TooltipTrigger>
        {#snippet child({ props })}
          <Button variant="outline" class="capitalize" {...props}>{side}</Button>
        {/snippet}
      </TooltipTrigger>
      <TooltipContent {side}>Anchored {side}</TooltipContent>
    </Tooltip>
  {/each}
</div>
