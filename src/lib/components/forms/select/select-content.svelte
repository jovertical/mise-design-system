<!--
  Origin: the React package 2.23.0 `select.tsx` (`SelectContent`), itself shadcn/ui new-york `select`
  Svelte: shadcn-svelte `select`
  Diverged: bits-ui positions the list as a popper only, so React's default
    item-aligned mode is gone; `sideOffset` replaces the per-side translates,
    and the size variables are bits-ui's.
-->
<script lang="ts" module>
  import { Select as SelectPrimitive } from 'bits-ui'

  import type { WithoutChild } from '../../../utils/types.js'

  /** A ring rather than a border, matching every other floating surface. */
  export type SelectContentProps = WithoutChild<SelectPrimitive.ContentProps> & {
    portalProps?: SelectPrimitive.PortalProps
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import SelectScrollDownButton from './select-scroll-down-button.svelte'
  import SelectScrollUpButton from './select-scroll-up-button.svelte'

  let {
    ref = $bindable(null),
    sideOffset = 4,
    portalProps,
    class: className,
    children,
    ...rest
  }: SelectContentProps = $props()
</script>

<SelectPrimitive.Portal {...portalProps}>
  <SelectPrimitive.Content
    bind:ref
    {sideOffset}
    data-slot="select-content"
    class={cn(
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--bits-select-content-available-height) min-w-[8rem] origin-(--bits-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-2xl shadow-lg ring-1 ring-foreground/5 dark:ring-foreground/10',
      className,
    )}
    {...rest}
  >
    <SelectScrollUpButton />
    <SelectPrimitive.Viewport
      class="h-(--bits-select-anchor-height) w-full min-w-(--bits-select-anchor-width) scroll-my-1 p-1"
    >
      {@render children?.()}
    </SelectPrimitive.Viewport>
    <SelectScrollDownButton />
  </SelectPrimitive.Content>
</SelectPrimitive.Portal>
