<!--
  Origin: the React package 2.23.0 `combobox.tsx` (`ComboboxChip`)
  Diverged: a plain element with its own remove button, since bits-ui has no
    Chip or ChipRemove; the caller removes the value in `onRemove`. Lucide's x
    for Tabler's.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /** One chosen value in `ComboboxChips`. */
  export type ComboboxChipProps = WithElementRef<HTMLAttributes<HTMLSpanElement>> & {
    showRemove?: boolean
    /** Called by the remove button; take the value out of the combobox's. */
    onRemove?: () => void
    /** Names the remove button: "Remove Valves". */
    removeLabel?: string
    disabled?: boolean
  }
</script>

<script lang="ts">
  import XIcon from '@lucide/svelte/icons/x'

  import { cn } from '../../../utils/cn.js'
  import Button from '../../actions/button/button.svelte'

  let {
    ref = $bindable(null),
    showRemove = true,
    onRemove,
    removeLabel = 'Remove',
    disabled = false,
    class: className,
    children,
    ...rest
  }: ComboboxChipProps = $props()
</script>

<span
  bind:this={ref}
  data-slot="combobox-chip"
  class={cn(
    'bg-background text-foreground flex h-[calc(--spacing(5.5))] w-fit items-center justify-center gap-1.5 rounded-full px-2 text-xs font-medium shadow-xs has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pr-0',
    className,
  )}
  {...rest}
>
  {@render children?.()}
  {#if showRemove}
    <Button
      variant="ghost"
      size="sm"
      iconOnly
      class="-ml-1 opacity-50 hover:opacity-100"
      data-slot="combobox-chip-remove"
      aria-label={removeLabel}
      {disabled}
      onclick={onRemove}
    >
      <XIcon class="pointer-events-none" />
    </Button>
  {/if}
</span>
