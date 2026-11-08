<!--
  Origin: the React package 2.23.0 `text.tsx`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { Tone } from '../../../utils/tone.js'
  import type { WithElementRef } from '../../../utils/types.js'

  export type TextSize = 'xs' | 'sm'
  export type TextWeight = 'normal' | 'medium' | 'semibold'

  const SIZE_CLASS: Record<TextSize, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
  }

  const WEIGHT_CLASS: Record<TextWeight, string> = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
  }

  /**
   * Body text, set by what it is doing rather than by the classes that draw it:
   * the size, the muting, the weight, the figures, and nothing else. No face,
   * no arbitrary size, no colour outside `muted` and the shared `Tone`. `as`
   * rather than `asChild`, because the element is the one semantic choice text
   * makes.
   */
  export type TextProps = WithElementRef<HTMLAttributes<HTMLElement>> & {
    /** `span` by default; `p` for a sentence that stands as a paragraph, `div` for text holding a block. */
    as?: 'span' | 'p' | 'div'
    /** `xs` 12px, `sm` 14px. Omit it to inherit the line's size. A larger step is a heading. */
    size?: TextSize
    /** De-emphasis, `text-muted-foreground`: a hint, a timestamp. Not a status. */
    muted?: boolean
    /** Status ink, for text that carries a state. Wins over `muted`. */
    tone?: Tone
    /** `medium` for a name or a value, `semibold` for a total, `normal` to undo an inherited weight. */
    weight?: TextWeight
    /** `tabular-nums`, so a column of figures lines up. */
    numeric?: boolean
    /** One line, ellipsised. Needs a width to truncate against. */
    truncate?: boolean
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { TONE_TEXT_CLASS } from '../../../utils/tone.js'

  let {
    ref = $bindable(null),
    as = 'span',
    size,
    muted = false,
    tone,
    weight,
    numeric = false,
    truncate = false,
    class: className,
    children,
    ...rest
  }: TextProps = $props()
</script>

<svelte:element
  this={as}
  bind:this={ref}
  data-slot="text"
  class={cn(
    size && SIZE_CLASS[size],
    tone ? TONE_TEXT_CLASS[tone] : muted && 'text-muted-foreground',
    weight && WEIGHT_CLASS[weight],
    numeric && 'tabular-nums',
    truncate && 'truncate',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</svelte:element>
