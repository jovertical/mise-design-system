<!--
  Origin: the React package 2.23.0 `breadcrumb.tsx` (`BreadcrumbLink`)
  Diverged: React's `asChild` becomes a `child` snippet that receives the
    link's props, for a router's own link component. A SvelteKit app needs only
    `href`, since its links are plain anchors.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAnchorAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type BreadcrumbLinkProps = WithElementRef<HTMLAnchorAttributes, HTMLAnchorElement> & {
    /** Renders your own link with these props instead of an anchor. */
    child?: Snippet<[{ props: Record<string, unknown> }]>
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    href,
    child,
    class: className,
    children,
    ...rest
  }: BreadcrumbLinkProps = $props()

  const linkProps = $derived({
    'data-slot': 'breadcrumb-link',
    class: cn('hover:text-foreground truncate transition-colors', className),
    ...rest,
  })
</script>

{#if child}
  {@render child({ props: { ...linkProps, href } })}
{:else}
  <a bind:this={ref} {href} {...linkProps}>{@render children?.()}</a>
{/if}
