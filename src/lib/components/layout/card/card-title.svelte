<!--
  Origin: the React package 2.23.0 `card.tsx` (`CardTitle`), itself shadcn/ui new-york `card`
  Svelte: shadcn-svelte `card`
  Diverged: takes `icon` and `iconTone`, absorbing React's `SectionTitle`
    (`section-title.tsx`).
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  import type { Tone } from '../../../utils/tone.js'
  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * A flex row, so a hint or a status badge sits on the title's baseline
   * without the caller arranging it. `min-w-0` lets a long title truncate
   * against its neighbour instead of pushing it out of the header.
   *
   * With an `icon`, it marks where a section starts, at `CardTitle`'s size, so
   * the heading labels the section rather than competing with the figures
   * inside it.
   */
  export type CardTitleProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    /** A leading glyph. Bare and muted at `size-4` unless `iconTone` is given. */
    icon?: Snippet
    /**
     * Draws `icon` in an `IconChip` of this tone. Omit it for a quiet heading.
     * `primary` when the headings are the page's structure, as on a long form.
     * Never a status tone: a heading is not a status.
     */
    iconTone?: Tone
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import IconChip from '../../data-display/icon-chip/icon-chip.svelte'

  let {
    ref = $bindable(null),
    class: className,
    icon,
    iconTone,
    children,
    ...rest
  }: CardTitleProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="card-title"
  class={cn('font-heading flex min-w-0 items-center gap-2 text-base font-medium', className)}
  {...rest}
>
  {#if icon && iconTone}
    <IconChip tone={iconTone}>{@render icon()}</IconChip>
  {:else if icon}
    <span class="text-muted-foreground [&_svg]:size-4">{@render icon()}</span>
  {/if}
  {@render children?.()}
</div>
