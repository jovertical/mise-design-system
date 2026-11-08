<!--
  Origin: the React package 2.23.0 `popover.tsx` (`PopoverContent`), itself shadcn/ui new-york `popover`
  Svelte: shadcn-svelte `popover`
  Diverged: the size and origin variables are bits-ui's
    (`--bits-popover-anchor-width` is the trigger's width).
-->
<script lang="ts" module>
  import { Popover as PopoverPrimitive } from 'bits-ui'

  /**
   * The floating panel. It is not a `flex flex-col gap-4` like the reference's
   * settings panel: most popovers are menus, filters or list panels that pass
   * `p-0` and own their layout, and `p-0` cancels padding but not a gap. Add
   * `flex flex-col gap-4` at the call site for the form case.
   */
  export type PopoverContentProps = PopoverPrimitive.ContentProps & {
    /**
     * The panel takes the trigger's exact width instead of its own `w-72`, and
     * drops the padding: the shape a Select-like popover wants, where the
     * content inside owns its own padding.
     */
    matchTriggerWidth?: boolean
    portalProps?: PopoverPrimitive.PortalProps
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    align = 'center',
    sideOffset = 4,
    matchTriggerWidth = false,
    portalProps,
    class: className,
    ...rest
  }: PopoverContentProps = $props()
</script>

<PopoverPrimitive.Portal {...portalProps}>
  <PopoverPrimitive.Content
    bind:ref
    data-slot="popover-content"
    {align}
    {sideOffset}
    class={cn(
      'bg-popover text-popover-foreground ring-foreground/5 dark:ring-foreground/10 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 origin-(--bits-popover-content-transform-origin) rounded-3xl text-sm shadow-lg ring-1 outline-hidden duration-100',
      matchTriggerWidth ? 'w-[var(--bits-popover-anchor-width)] p-0' : 'w-72 p-4',
      className,
    )}
    {...rest}
  />
</PopoverPrimitive.Portal>
