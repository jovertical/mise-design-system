<!--
  Origin: the React package 2.23.0 `segmented-code.tsx`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { Size } from '../../../utils/tone.js'

  const SIZE_CLASS: Record<Size, string> = {
    sm: 'h-9 text-sm',
    md: 'h-11 text-base',
    lg: 'h-13 text-lg',
  }

  /** A box's side padding grows with its type, so a 29-character key still fits a dialog at `sm`. */
  const BOX_PADDING_CLASS: Record<Size, string> = {
    sm: 'px-2',
    md: 'px-2.5',
    lg: 'px-3',
  }

  /** Splits `characters` into consecutive runs of `groups[i]` characters. */
  function segmentsOf(characters: string, groups: readonly number[]): string[] {
    return groups.map((groupLength, index) => {
      const groupStart = groups.slice(0, index).reduce((total, length) => total + length, 0)
      return characters.slice(groupStart, groupStart + groupLength)
    })
  }

  /**
   * A code to read off a screen and type in somewhere else, in joined boxes of
   * a few characters each, so a key reads here in the same groups the device
   * asks for it in. The operator reads a box, types a box.
   *
   * **Display only.** Copying, revealing and downloading are the caller's
   * buttons: what a code allows differs by credential, and a key that works
   * once wants a different set from a pairing code that expires.
   *
   * **In a muted strip.** The strip sets the code apart from the prose around
   * it, as a `<code>` span does in a paragraph.
   */
  export type SegmentedCodeProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    /**
     * The code as issued (`66G6D-ME7021KJ6JBFN82MAWQA9VCV`). Hyphens and spaces
     * are dropped before it is split, so the groups decide where it breaks.
     */
    value: string
    /** How many characters each box holds, left to right: `[5, 4, 4, 4, 4, 4, 4]`. */
    groups: readonly number[]
    size?: Size
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { value, groups, size = 'md', class: className, ...rest }: SegmentedCodeProps = $props()

  const segments = $derived(segmentsOf(value.replace(/[\s-]/g, ''), groups))
</script>

<div
  data-slot="segmented-code"
  class={cn(
    'bg-muted border-border inline-flex max-w-full overflow-hidden rounded-lg border font-semibold',
    SIZE_CLASS[size],
    className,
  )}
  {...rest}
>
  <!-- A segment's position is its identity: two can hold the same text, and the
       groups are fixed, never reordered. -->
  {#each segments as segment, index (index)}
    <span
      class={cn(
        'border-border flex items-center justify-center border-l tracking-wide first:border-l-0',
        BOX_PADDING_CLASS[size],
      )}
    >
      {segment}
    </span>
  {/each}
</div>
