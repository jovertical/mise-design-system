<!--
  Origin: the React package 2.23.0 `combobox.tsx` (`ComboboxChips`)
  Diverged: a plain element, since bits-ui has no Chips part. Bind its `ref`
    and pass it to ComboboxContent's `customAnchor`, where React used
    `useComboboxAnchor`.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * The field for a multiple combobox: the chosen values as chips, then a
   * `ComboboxChipsInput` to type into, wrapped as one Input-like box.
   */
  export type ComboboxChipsProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: ComboboxChipsProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="combobox-chips"
  class={cn(
    'bg-input/50 focus-within:border-ring focus-within:ring-ring/50 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive dark:has-aria-invalid:border-destructive/50 flex min-h-9 flex-wrap items-center gap-1.5 rounded-2xl border border-transparent bg-clip-padding px-2.5 py-1.5 text-sm shadow-xs transition-[color,box-shadow] focus-within:ring-[3px] has-aria-invalid:ring-[3px] has-data-[slot=combobox-chip]:px-1.5',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
