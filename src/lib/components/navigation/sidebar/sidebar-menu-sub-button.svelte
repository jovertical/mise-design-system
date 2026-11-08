<!--
  Origin: the React package 2.23.0 `sidebar.tsx` (`SidebarMenuSubButton`), itself shadcn/ui new-york `sidebar`
  Svelte: shadcn-svelte `sidebar`
  Diverged: React's `asChild` becomes a `child` snippet that receives the
    part's props, as in BreadcrumbLink.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAnchorAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type SidebarMenuSubButtonProps = WithElementRef<
    HTMLAnchorAttributes,
    HTMLAnchorElement
  > & {
    /** Renders your own element with these props instead of the default one. */
    child?: Snippet<[{ props: Record<string, unknown> }]>
    size?: 'sm' | 'md'
    isActive?: boolean
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    href,
    child,
    size = 'md',
    isActive = false,
    class: className,
    children,
    ...rest
  }: SidebarMenuSubButtonProps = $props()

  const partProps = $derived({
    'data-slot': 'sidebar-menu-sub-button',
    'data-sidebar': 'menu-sub-button',
    'data-size': size,
    'data-active': isActive,
    class: cn(
      'ring-sidebar-ring flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-r-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
      'group-data-[sidetheme=primary]:text-white/90 group-data-[sidetheme=primary]:hover:bg-white/15 group-data-[sidetheme=primary]:hover:text-white group-data-[sidetheme=primary]:active:bg-white/20',
      'group-data-[sidetheme=primary]:data-[active=true]:bg-white group-data-[sidetheme=primary]:data-[active=true]:text-black group-data-[sidetheme=primary]:data-[active=true]:font-medium group-data-[sidetheme=primary]:data-[active=true]:shadow-sm',
      'group-data-[sidetheme=light]:text-muted-foreground group-data-[sidetheme=light]:hover:bg-black/5 group-data-[sidetheme=light]:hover:text-foreground',
      'group-data-[sidetheme=light]:data-[active=true]:bg-primary-600 group-data-[sidetheme=light]:data-[active=true]:text-white group-data-[sidetheme=light]:data-[active=true]:font-medium',
      'group-data-[sidetheme=panel]:rounded-xl group-data-[sidetheme=panel]:text-muted-foreground group-data-[sidetheme=panel]:hover:bg-sidebar-accent group-data-[sidetheme=panel]:hover:text-sidebar-foreground',
      'group-data-[sidetheme=panel]:data-[active=true]:bg-sidebar-primary group-data-[sidetheme=panel]:data-[active=true]:text-sidebar-primary-foreground group-data-[sidetheme=panel]:data-[active=true]:font-medium',
      size === 'sm' && 'text-xs',
      size === 'md' && 'text-sm',
      'group-data-[collapsible=icon]:hidden',
      className,
    ),
    ...rest,
  })
</script>

{#if child}
  {@render child({ props: { ...partProps, href } })}
{:else}
  <a bind:this={ref} {href} {...partProps}>{@render children?.()}</a>
{/if}
