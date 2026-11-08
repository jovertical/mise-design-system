<!--
  Origin: the React package 2.23.0 `sidebar.tsx` (`SidebarGroupLabel`), itself shadcn/ui new-york `sidebar`
  Svelte: shadcn-svelte `sidebar`
  Diverged: React's `asChild` becomes a `child` snippet that receives the
    part's props, as in BreadcrumbLink.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type SidebarGroupLabelProps = WithElementRef<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & {
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
  }: SidebarGroupLabelProps = $props()

  const partProps = $derived({
    'data-slot': 'sidebar-group-label',
    'data-sidebar': 'group-label',
    class: cn(
      'ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
      'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
      'group-data-[sidetheme=primary]:text-white/70 group-data-[sidetheme=light]:text-muted-foreground',
      'group-data-[sidetheme=panel]:text-muted-foreground group-data-[sidetheme=panel]:mt-2 group-data-[sidetheme=panel]:mb-0.5 group-data-[sidetheme=panel]:h-6 group-data-[sidetheme=panel]:px-2.5 group-data-[sidetheme=panel]:text-[0.6875rem] group-data-[sidetheme=panel]:font-semibold group-data-[sidetheme=panel]:tracking-[0.08em] group-data-[sidetheme=panel]:uppercase',
      className,
    ),
    ...rest,
  })
</script>

{#if child}
  {@render child({ props: partProps })}
{:else}
  <div bind:this={ref} {...partProps}>{@render children?.()}</div>
{/if}
