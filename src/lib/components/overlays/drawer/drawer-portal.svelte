<!--
  Origin: the React package 2.23.0 `drawer.tsx` (`DrawerPortal`), itself shadcn/ui new-york `drawer`
  Svelte: shadcn-svelte `drawer`
  Diverged: unaudited, as in the React package.
-->
<script lang="ts" module>
  import { Drawer as DrawerPrimitive } from 'vaul-svelte'

  export type DrawerPortalProps = DrawerPrimitive.PortalProps
</script>

<script lang="ts">
  let { ...rest }: DrawerPortalProps = $props()
</script>

<DrawerPrimitive.Portal {...rest} />
