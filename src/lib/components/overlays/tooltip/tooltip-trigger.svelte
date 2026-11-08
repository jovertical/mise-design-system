<!--
  Origin: the React package 2.23.0 `tooltip.tsx` (`TooltipTrigger`), itself shadcn/ui new-york `tooltip`
  Svelte: shadcn-svelte `tooltip`
  Diverged: `asChild` is bits-ui's `child` snippet.
-->
<script lang="ts" module>
  import { Tooltip as TooltipPrimitive } from 'bits-ui'

  export type TooltipTriggerProps = TooltipPrimitive.TriggerProps
</script>

<script lang="ts">
  let { ref = $bindable(null), ...rest }: TooltipTriggerProps = $props()
</script>

<TooltipPrimitive.Trigger bind:ref data-slot="tooltip-trigger" {...rest} />
