<!--
  Origin: the React package 2.23.0 `icon-chip.tsx`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { Size, Tone } from '../../../utils/tone.js'
  import type { WithElementRef } from '../../../utils/types.js'
  import type { IconChipShape } from './icon-chip-variants.js'

  /**
   * A glyph on a tinted tile: the leading mark of a fact, a heading, a tile, a
   * row. `sm` by default because most chips sit beside a line of text; `md` and
   * `lg` stand in open space. Neutral is muted ink on `--muted`: a chip takes a
   * colour only when the thing it marks is in a state worth one.
   */
  export type IconChipProps = WithElementRef<HTMLAttributes<HTMLSpanElement>> & {
    /** `sm` 32px, `md` 40px, `lg` 48px. */
    size?: Size
    /**
     * `square` is a squircle whose radius steps with the size; `circle` is for a
     * composition that has chosen it. The slot owns the shape, not what sits in it.
     */
    shape?: IconChipShape
    tone?: Tone
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { iconChipClassName } from './icon-chip-variants.js'

  let {
    ref = $bindable(null),
    size = 'sm',
    shape = 'square',
    tone = 'neutral',
    class: className,
    children,
    ...rest
  }: IconChipProps = $props()
</script>

<span
  bind:this={ref}
  data-slot="icon-chip"
  data-tone={tone}
  class={cn(iconChipClassName({ size, shape, tone }), className)}
  {...rest}
>
  {@render children?.()}
</span>
