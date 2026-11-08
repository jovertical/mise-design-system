<!--
  Origin: the React package 2.23.0 `drawer.tsx` (`DrawerTrigger`), itself shadcn/ui new-york `drawer`
  Svelte: shadcn-svelte `drawer`
  Diverged: unaudited, as in the React package. `asChild` is bits-ui's `child` snippet.
-->
<script lang="ts" module>
  import { Drawer as DrawerPrimitive } from 'vaul-svelte'

  export type DrawerTriggerProps = DrawerPrimitive.TriggerProps
</script>

<script lang="ts">
  let { ref = $bindable(null), ...rest }: DrawerTriggerProps = $props()
</script>

<DrawerPrimitive.Trigger bind:ref data-slot="drawer-trigger" {...rest} />
