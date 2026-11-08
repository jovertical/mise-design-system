<!--
  Origin: the React package 2.23.0 `badge.tsx`, itself shadcn/ui new-york `badge`
  Svelte: shadcn-svelte `badge`
  Diverged: `asChild` dropped for `href`, which renders an <a>; the
    `[a&]:hover:opacity-90` class already styles that case.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAnchorAttributes } from 'svelte/elements'

  import type { Tone } from '../../../utils/tone.js'
  import type { WithElementRef } from '../../../utils/types.js'
  import type { BadgeVariant } from './badge-variants.js'

  /**
   * A short label on a row: a status, a tag, a count. Colour and shape are two
   * props because they are two decisions. Whether a badge is a state (`soft`),
   * a thing done (`solid`) or a tag (`outline`) is the composition's call;
   * what that state is (`success`, `critical`) is the data's.
   */
  export type BadgeProps = WithElementRef<HTMLAnchorAttributes> & {
    /**
     * `soft` is a state something is in. `solid` is a thing that was done, and
     * shouts. `outline` is a tag: metadata the reader may want, not a state to
     * act on.
     */
    variant?: BadgeVariant
    tone?: Tone
    /**
     * A number on its own: one digit draws a circle and more stretch it into a
     * pill of the same height, so a column of counts keeps one silhouette.
     */
    count?: boolean
    children?: Snippet
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { badgeVariants } from './badge-variants.js'

  let {
    variant = 'soft',
    tone = 'neutral',
    count = false,
    href,
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: BadgeProps = $props()
</script>

<svelte:element
  this={href ? 'a' : 'span'}
  bind:this={ref}
  {href}
  data-slot="badge"
  data-variant={variant}
  data-tone={tone}
  data-count={count || undefined}
  class={cn(badgeVariants({ variant, tone, count }), className)}
  {...rest}
>
  {@render children?.()}
</svelte:element>
