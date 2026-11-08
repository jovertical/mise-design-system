<!--
  Origin: the React package 2.23.0 `drawer.tsx` (`DrawerClose`), itself shadcn/ui new-york `drawer`
  Svelte: shadcn-svelte `drawer`
  Diverged: unaudited, as in the React package. `asChild` is bits-ui's `child` snippet.
-->
<script lang="ts" module>
  import { Drawer as DrawerPrimitive } from 'vaul-svelte'

  export type DrawerCloseProps = DrawerPrimitive.CloseProps
</script>

<script lang="ts">
  let { ref = $bindable(null), ...rest }: DrawerCloseProps = $props()
</script>

<DrawerPrimitive.Close bind:ref data-slot="drawer-close" {...rest} />
