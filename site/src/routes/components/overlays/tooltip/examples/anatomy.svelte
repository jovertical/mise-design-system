<!--
  Open on the page, for the anatomy, above its trigger wherever the page is
  scrolled; placed absolutely, since a tooltip is placed against the viewport
  and the contained stage would put it out of view.
-->
<script lang="ts">
  import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@jovertical/mise-design-system'

  // Opened once mounted: a tooltip that starts open is never positioned.
  let open = $state(false)

  $effect(() => {
    open = true
  })
</script>

<Tooltip bind:open>
  <TooltipTrigger>
    {#snippet child({ props })}
      <Button variant="outline" {...props}>Suspend register</Button>
    {/snippet}
  </TooltipTrigger>
  <TooltipContent
    side="top"
    strategy="absolute"
    avoidCollisions={false}
    portalProps={{ disabled: true }}
  >
    Stops sales until a manager resumes it
  </TooltipContent>
</Tooltip>
