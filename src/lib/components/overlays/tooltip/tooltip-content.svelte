<!--
  Origin: the React package 2.23.0 `tooltip.tsx` (`TooltipContent`), itself shadcn/ui new-york `tooltip`
  Svelte: shadcn-svelte `tooltip`
  Diverged: the transform origin reads bits-ui's variable. bits-ui's Arrow does
    not rotate itself per side as Radix's did, so the arrow is a `child` div with
    React's surface classes and shadcn-svelte's per-side transforms.
-->
<script lang="ts" module>
  import { Tooltip as TooltipPrimitive } from 'bits-ui'

  /**
   * The panel sits on `bg-popover` with the ring and shadow every floating
   * panel here carries, not the inverted `bg-foreground text-background`
   * tooltip idiom. The inversion looks deliberate in light mode and renders a
   * page-bright block over a dark UI in dark mode. The arrow follows the
   * surface and carries no ring of its own.
   */
  export type TooltipContentProps = TooltipPrimitive.ContentProps & {
    portalProps?: TooltipPrimitive.PortalProps
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    sideOffset = 0,
    portalProps,
    class: className,
    children,
    ...rest
  }: TooltipContentProps = $props()
</script>

<TooltipPrimitive.Portal {...portalProps}>
  <TooltipPrimitive.Content
    bind:ref
    data-slot="tooltip-content"
    {sideOffset}
    class={cn(
      'bg-popover text-popover-foreground ring-foreground/5 dark:ring-foreground/10 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--bits-tooltip-content-transform-origin) rounded-xl px-3 py-1.5 text-xs text-balance shadow-lg ring-1',
      className,
    )}
    {...rest}
  >
    {@render children?.()}
    <TooltipPrimitive.Arrow>
      {#snippet child({ props })}
        <div
          data-slot="tooltip-arrow"
          class="bg-popover fill-popover z-50 size-2.5 rotate-45 rounded-[2px] data-[side=bottom]:-translate-x-1/2 data-[side=bottom]:-translate-y-[calc(-50%+1px)] data-[side=left]:-translate-y-[calc(50%-3px)] data-[side=right]:translate-x-[calc(50%+2px)] data-[side=right]:translate-y-1/2 data-[side=top]:translate-x-1/2 data-[side=top]:translate-y-[calc(-50%+2px)]"
          {...props}
        ></div>
      {/snippet}
    </TooltipPrimitive.Arrow>
  </TooltipPrimitive.Content>
</TooltipPrimitive.Portal>
