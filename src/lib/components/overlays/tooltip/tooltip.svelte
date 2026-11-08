<!--
  Origin: the React package 2.23.0 `tooltip.tsx` (`Tooltip`), itself shadcn/ui new-york `tooltip`
  Svelte: shadcn-svelte `tooltip`
  Diverged: none beyond the port. Each Tooltip brings its own provider, as the
    React one does, so a tooltip works without an app-level TooltipProvider.
-->
<script lang="ts" module>
  import { Tooltip as TooltipPrimitive } from 'bits-ui'

  export type TooltipProps = TooltipPrimitive.RootProps
</script>

<script lang="ts">
  import TooltipProvider from './tooltip-provider.svelte'

  let { open = $bindable(false), ...rest }: TooltipProps = $props()
</script>

<TooltipProvider>
  <TooltipPrimitive.Root bind:open {...rest} />
</TooltipProvider>
