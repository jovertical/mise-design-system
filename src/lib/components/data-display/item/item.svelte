<!--
  Origin: the React package 2.23.0 `item.tsx` (`Item`), itself shadcn/ui new-york `item`
  Svelte: shadcn-svelte `item`
  Diverged: the `flush` size (py-1.5 px-0), carried over from the React package, for
    rows inside a card; size `default` is `md`. A row rendered as an `a` or
    a `button` hovers on `--muted`, not `--accent`. React's `asChild` is
    `href` (the row renders an `a`) or a `child` snippet that receives the
    merged props, for a `button` row.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'
  import type { ItemSize, ItemVariant } from './item-variants.js'

  /**
   * A **list row**, not a menu row. `DropdownMenuItem` is a command: it lives
   * in a `role="menu"`, moves with the arrow keys and closes on select. This
   * carries media, a title, a description and its own actions, and `ItemGroup`
   * is a `role="list"`. A notification feed or a device list is this; a set of
   * commands is the other.
   *
   * `sm` is what nearly every call site wants, because `md`'s `p-4 gap-4` is a
   * card's padding on something that is a row inside one. `flush` drops the
   * horizontal padding for a row whose container supplies it.
   *
   * A row you can click is a link or a button, never a `div` with an
   * `onclick`: pass `href`, or render a `button` through `child`.
   */
  export type ItemProps = WithElementRef<HTMLAttributes<HTMLElement>> & {
    variant?: ItemVariant
    size?: ItemSize
    /** Renders the row as an `a` to this address. */
    href?: string
    child?: Snippet<[{ props: Record<string, unknown> }]>
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { itemVariants } from './item-variants.js'

  let {
    ref = $bindable(null),
    variant = 'default',
    size = 'md',
    href,
    child,
    class: className,
    children,
    ...rest
  }: ItemProps = $props()

  const merged = $derived({
    ...rest,
    'data-slot': 'item',
    'data-variant': variant,
    'data-size': size,
    class: cn(itemVariants({ variant, size }), className),
  })
</script>

{#if child}
  {@render child({ props: merged })}
{:else if href}
  <a bind:this={ref} {href} {...merged}>{@render children?.()}</a>
{:else}
  <div bind:this={ref} {...merged}>{@render children?.()}</div>
{/if}
