<!--
  Origin: the React package 2.23.0 `sidebar.tsx` (`SidebarGroupAction`), itself shadcn/ui new-york `sidebar`
  Svelte: shadcn-svelte `sidebar`
  Diverged: React's `asChild` becomes a `child` snippet that receives the
    part's props, as in BreadcrumbLink.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type SidebarGroupActionProps = WithElementRef<HTMLButtonAttributes, HTMLButtonElement> & {
    /** Renders your own element with these props instead of the default one. */
    child?: Snippet<[{ props: Record<string, unknown> }]>
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    child,
    class: className,
    children,
    ...rest
  }: SidebarGroupActionProps = $props()

  const partProps = $derived({
    'data-slot': 'sidebar-group-action',
    'data-sidebar': 'group-action',
    class: cn(
      'ring-sidebar-ring absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
      'group-data-[sidetheme=primary]:text-white group-data-[sidetheme=primary]:hover:bg-white/20',
      'group-data-[sidetheme=light]:text-muted-foreground group-data-[sidetheme=light]:hover:bg-black/5 group-data-[sidetheme=light]:hover:text-foreground',
      'group-data-[sidetheme=panel]:text-muted-foreground group-data-[sidetheme=panel]:hover:bg-sidebar-accent group-data-[sidetheme=panel]:hover:text-sidebar-foreground',
      'after:absolute after:-inset-2 md:after:hidden',
      'group-data-[collapsible=icon]:hidden',
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
