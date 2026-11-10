<!--
  Origin: the React package 2.23.0 `sidebar.tsx` (`SidebarMenuAction`), itself shadcn/ui new-york `sidebar`
  Svelte: shadcn-svelte `sidebar`
  Diverged: React's `asChild` becomes a `child` snippet that receives the
    part's props, as in BreadcrumbLink. On `panel`, it sits on the 32px row
    whatever the button's size, as the portals placed it.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type SidebarMenuActionProps = WithElementRef<HTMLButtonAttributes, HTMLButtonElement> & {
    /** Renders your own element with these props instead of the default one. */
    child?: Snippet<[{ props: Record<string, unknown> }]>
    /** Shows the action only while its row is hovered or focused, from `md`. */
    showOnHover?: boolean
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    child,
    showOnHover = false,
    class: className,
    children,
    ...rest
  }: SidebarMenuActionProps = $props()

  const partProps = $derived({
    'data-slot': 'sidebar-menu-action',
    'data-sidebar': 'menu-action',
    class: cn(
      'ring-sidebar-ring absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
      'group-data-[sidetheme=primary]:text-white group-data-[sidetheme=primary]:hover:bg-white/20 group-data-[sidetheme=primary]:peer-hover/menu-button:text-white',
      'group-data-[sidetheme=light]:text-muted-foreground group-data-[sidetheme=light]:hover:bg-black/5 group-data-[sidetheme=light]:hover:text-foreground group-data-[sidetheme=light]:peer-hover/menu-button:text-foreground group-data-[sidetheme=light]:peer-data-[active=true]/menu-button:text-white',
      'group-data-[sidetheme=panel]:text-muted-foreground group-data-[sidetheme=panel]:hover:bg-sidebar-accent group-data-[sidetheme=panel]:hover:text-sidebar-foreground group-data-[sidetheme=panel]:peer-data-[active=true]/menu-button:text-sidebar-primary-foreground',
      'after:absolute after:-inset-2 md:after:hidden',
      'peer-data-[size=sm]/menu-button:top-1',
      'peer-data-[size=default]/menu-button:top-1.5',
      'peer-data-[size=lg]/menu-button:top-2.5',
      // A panel row is 32px whatever its size, so the action sits on that.
      'group-data-[sidetheme=panel]:top-1.5! group-data-[sidetheme=panel]:right-2',
      'group-data-[collapsible=icon]:hidden',
      showOnHover &&
        'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0',
      className,
    ),
    ...rest,
  })
</script>

{#if child}
  {@render child({ props: partProps })}
{:else}
  <button bind:this={ref} type="button" {...partProps}>{@render children?.()}</button>
{/if}
