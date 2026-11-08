<!--
  Origin: the React package 2.23.0 `drawer.tsx` (`Drawer`), itself shadcn/ui new-york `drawer`
  Svelte: shadcn-svelte `drawer`
  Diverged: unaudited, as in the React package. vaul-svelte for vaul, with
    `bind:open` and `bind:activeSnapPoint`. `shouldScaleBackground` stays
    vaul's default, off, as React leaves it; shadcn-svelte turns it on.
-->
<script lang="ts" module>
  import { Drawer as DrawerPrimitive } from 'vaul-svelte'

  /**
   * A panel dragged in from an edge. Slides from the bottom by default: the
   * phone sheet, for a screen that wants a bottom sheet rather than a centred
   * `Dialog`. `direction="right"` makes it a side panel, though `Sheet` is the
   * usual one there.
   */
  export type DrawerProps = DrawerPrimitive.RootProps
</script>

<script lang="ts">
  let {
    open = $bindable(false),
    activeSnapPoint = $bindable(null),
    ...rest
  }: DrawerProps = $props()
</script>

<DrawerPrimitive.Root bind:open bind:activeSnapPoint {...rest} />
