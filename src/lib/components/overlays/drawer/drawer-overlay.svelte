<!--
  Origin: the React package 2.23.0 `drawer.tsx` (`DrawerOverlay`), itself shadcn/ui new-york `drawer`
  Svelte: shadcn-svelte `drawer`
  Diverged: unaudited, as in the React package.
-->
<script lang="ts" module>
  import { Drawer as DrawerPrimitive } from 'vaul-svelte'

  export type DrawerOverlayProps = DrawerPrimitive.OverlayProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: DrawerOverlayProps = $props()
</script>

<DrawerPrimitive.Overlay
  bind:ref
  data-slot="drawer-overlay"
  class={cn(
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
    className,
  )}
  {...rest}
/>
