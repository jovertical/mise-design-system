<!--
  Origin: mise
  Diverged: none. The React package left the back link to each page;
    bertos-bakery-ops' audit found every create and edit page drawing its own
    (2026-11-10). It draws the link those pages and the stories already drew.
-->
<script lang="ts" module>
  import type { HTMLAnchorAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * The way back out of a create or edit page, for `PageHeader`'s `backLink`:
   * a muted link with an arrow and the parent's name. An app whose router needs
   * its own navigation attaches it, as to any link.
   */
  export type PageHeaderBackLinkProps = WithElementRef<HTMLAnchorAttributes> & {
    href: string
  }
</script>

<script lang="ts">
  import IconArrowLeft from '@tabler/icons-svelte-runes/icons/arrow-left'

  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    href,
    class: className,
    children,
    ...rest
  }: PageHeaderBackLinkProps = $props()
</script>

<a
  bind:this={ref}
  {href}
  data-slot="page-header-back-link"
  class={cn(
    'text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1.5 text-sm',
    className,
  )}
  {...rest}
>
  <IconArrowLeft class="size-4" />
  {@render children?.()}
</a>
