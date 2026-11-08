<!--
  Origin: the React package 2.23.0 `item.tsx` (`ItemMedia`), itself shadcn/ui new-york `item`
  Svelte: shadcn-svelte `item`
  Diverged: the icon media is `IconChip`'s chip (`rounded-lg` without a border,
    rather than `rounded-sm` with one) and takes its `size`, `shape` and
    `tone`, carried over from the React package.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { Size, Tone } from '../../../utils/tone.js'
  import type { WithElementRef } from '../../../utils/types.js'
  import type { IconChipShape } from '../icon-chip/icon-chip-variants.js'
  import type { ItemMediaVariant } from './item-variants.js'

  /**
   * `variant="icon"` is `IconChip`'s chip, drawn on this element rather than
   * nested inside it, so the slot's alignment (top-aligned beside a
   * description) stays on the chip. Size it up to `md` for an entity standing
   * alone under a card title; `sm` is tuned for a dense list.
   */
  export type ItemMediaProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    variant?: ItemMediaVariant
    /** `variant="icon"` only: the chip's footprint, `sm` 32px, `md` 40px, `lg` 48px. */
    size?: Size
    /** `variant="icon"` only. `circle` where the row stands for a person. */
    shape?: IconChipShape
    /** `variant="icon"` only. Neutral unless the row is in a state worth a colour. */
    tone?: Tone
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { iconChipClassName } from '../icon-chip/icon-chip-variants.js'
  import { itemMediaVariants } from './item-variants.js'

  let {
    ref = $bindable(null),
    variant = 'default',
    size = 'sm',
    shape = 'square',
    tone = 'neutral',
    class: className,
    children,
    ...rest
  }: ItemMediaProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="item-media"
  data-variant={variant}
  data-tone={variant === 'icon' ? tone : undefined}
  class={cn(
    itemMediaVariants({ variant }),
    variant === 'icon' && iconChipClassName({ size, shape, tone }),
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
