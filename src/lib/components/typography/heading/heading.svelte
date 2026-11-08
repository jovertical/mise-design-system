<!--
  Origin: the React package 2.23.0 `heading.tsx`
  Diverged: none beyond the port. The heading face is whatever `--font-heading`
    resolves to in the theme, not the React package's IBM Plex Sans.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { Size } from '../../../utils/tone.js'
  import type { WithElementRef } from '../../../utils/types.js'

  export const HEADING_SIZE_CLASS: Record<Size, string> = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  }

  /**
   * A heading that is not a card's, a dialog's or a page's: those have
   * `CardTitle`, `DialogTitle` and `PageHeader`. This is a section inside a page
   * body, so the face, the weight and the step come from one place. A figure is
   * not a heading.
   */
  export type HeadingProps = WithElementRef<
    HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  > & {
    /**
     * The level, for the document outline. `h2` by default; a page's `h1` is
     * `PageHeader`'s. Choose it by where the heading sits, never by how big it
     * should look; that is `size`.
     */
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    /** `sm` 16px (a card's title), `md` 18px (a dialog's), `lg` 20px (a section opening a page body). */
    size?: Size
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    as = 'h2',
    size = 'md',
    class: className,
    children,
    ...rest
  }: HeadingProps = $props()
</script>

<svelte:element
  this={as}
  bind:this={ref}
  data-slot="heading"
  class={cn('font-heading leading-snug font-semibold', HEADING_SIZE_CLASS[size], className)}
  {...rest}
>
  {@render children?.()}
</svelte:element>
