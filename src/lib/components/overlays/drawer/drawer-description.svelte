<!--
  Origin: the React package 2.23.0 `drawer.tsx` (`DrawerDescription`), itself shadcn/ui new-york `drawer`
  Svelte: shadcn-svelte `drawer`
  Diverged: unaudited, as in the React package.
-->
<script lang="ts" module>
  import { Drawer as DrawerPrimitive } from 'vaul-svelte'

  export type DrawerDescriptionProps = DrawerPrimitive.DescriptionProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: DrawerDescriptionProps = $props()
</script>

<DrawerPrimitive.Description
  bind:ref
  data-slot="drawer-description"
  class={cn('text-muted-foreground text-sm', className)}
  {...rest}
/>
