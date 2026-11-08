<!--
  Origin: the React package 2.23.0 `drawer.tsx` (`DrawerContent`), itself shadcn/ui new-york `drawer`
  Svelte: shadcn-svelte `drawer`
  Diverged: unaudited, as in the React package. The portal takes `portalProps`, as
    PopoverContent's does.
-->
<script lang="ts" module>
  import { Drawer as DrawerPrimitive } from 'vaul-svelte'

  /** The panel, its overlay and, from the bottom, the drag handle. */
  export type DrawerContentProps = DrawerPrimitive.ContentProps & {
    portalProps?: DrawerPrimitive.PortalProps
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import DrawerOverlay from './drawer-overlay.svelte'
  import DrawerPortal from './drawer-portal.svelte'

  let {
    ref = $bindable(null),
    portalProps,
    class: className,
    children,
    ...rest
  }: DrawerContentProps = $props()
</script>

<DrawerPortal {...portalProps}>
  <DrawerOverlay />
  <DrawerPrimitive.Content
    bind:ref
    data-slot="drawer-content"
    class={cn(
      'group/drawer-content bg-background fixed z-50 flex h-auto flex-col',
      'data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b',
      'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t',
      'data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm',
      'data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm',
      className,
    )}
    {...rest}
  >
    <div
      class="bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block"
    ></div>
    {@render children?.()}
  </DrawerPrimitive.Content>
</DrawerPortal>
