<!--
  Origin: mise
  Diverged: none. SiteHeader has no React original: the client portal draws
    its bar in app code, and the logistics example and bertos-bakery-ops each
    composed one (2026-11-10). mise draws it once.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * The bar above every page: a card floating on a blurred band that stays at
   * the top while the page scrolls under it. Put the sidebar's trigger, a
   * breadcrumb, `CommandTrigger` and the scheme or user menus inside, in a row;
   * `SiteHeaderSeparator` divides groups.
   *
   * The card is capped at the content column (`max-w-content`) and padded as
   * `PageLayout` pads the page, so its edges line up with the page's. Pass
   * `contentClass` where an app's column is narrower.
   */
  export type SiteHeaderProps = WithElementRef<HTMLAttributes<HTMLElement>> & {
    /** Classes for the column the card sits in: its cap and padding. */
    contentClass?: string
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    contentClass,
    class: className,
    children,
    ...rest
  }: SiteHeaderProps = $props()
</script>

<header
  bind:this={ref}
  data-slot="site-header"
  class={cn(
    'bg-muted/80 supports-[backdrop-filter]:bg-muted/60 sticky top-0 z-20 shrink-0 py-2 backdrop-blur',
    className,
  )}
  {...rest}
>
  <div
    data-slot="site-header-content"
    class={cn('mx-auto w-full px-4 lg:px-6', contentClass ?? 'max-w-content')}
  >
    <div
      data-slot="site-header-bar"
      class="bg-card flex h-12 w-full items-center gap-2 rounded-xl border px-2"
    >
      {@render children?.()}
    </div>
  </div>
</header>
