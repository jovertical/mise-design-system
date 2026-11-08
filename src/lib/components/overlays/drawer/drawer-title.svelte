<!--
  Origin: the React package 2.23.0 `drawer.tsx` (`DrawerTitle`), itself shadcn/ui new-york `drawer`
  Svelte: shadcn-svelte `drawer`
  Diverged: unaudited, as in the React package.
-->
<script lang="ts" module>
  import { Drawer as DrawerPrimitive } from 'vaul-svelte'

  export type DrawerTitleProps = DrawerPrimitive.TitleProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: DrawerTitleProps = $props()
</script>

<DrawerPrimitive.Title
  bind:ref
  data-slot="drawer-title"
  class={cn('text-foreground font-semibold', className)}
  {...rest}
/>
