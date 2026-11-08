<!--
  Origin: the React package 2.23.0 `tooltip.tsx` (`TooltipProvider`), itself shadcn/ui new-york `tooltip`
  Svelte: shadcn-svelte `tooltip`
  Diverged: none beyond the port. `delayDuration` defaults to 0, as in React.
-->
<script lang="ts" module>
  import { Tooltip as TooltipPrimitive } from 'bits-ui'

  export type TooltipProviderProps = TooltipPrimitive.ProviderProps
</script>

<script lang="ts">
  let { delayDuration = 0, ...rest }: TooltipProviderProps = $props()
</script>

<TooltipPrimitive.Provider {delayDuration} {...rest} />
