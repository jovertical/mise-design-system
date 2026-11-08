<!--
  Origin: the React package 2.23.0 `popover.tsx` (`Popover`), itself shadcn/ui new-york `popover`
  Svelte: shadcn-svelte `popover`
  Diverged: bits-ui Popover for Radix, with `bind:open`. React's `PopoverAnchor`
    has no bits-ui part; PopoverContent's `customAnchor` prop does its job.
-->
<script lang="ts" module>
  import { Popover as PopoverPrimitive } from 'bits-ui'

  /**
   * A positioned panel with no semantics of its own; whatever goes in it brings
   * its meaning. Reach for it when the content is not a list of commands: a
   * filter, a form, a preview, a feed. Commands want `DropdownMenu`.
   */
  export type PopoverProps = PopoverPrimitive.RootProps
</script>

<script lang="ts">
  let { open = $bindable(false), ...rest }: PopoverProps = $props()
</script>

<PopoverPrimitive.Root bind:open {...rest} />
