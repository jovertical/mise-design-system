<!--
  Origin: the React package 2.23.0 `select.tsx` (`SelectTrigger`), itself shadcn/ui new-york `select`
  Svelte: shadcn-svelte `select`
  Diverged: none beyond the port. The chevron is drawn inline; bits-ui has no Icon part.
-->
<script lang="ts" module>
  import { Select as SelectPrimitive } from 'bits-ui'

  import type { WithoutChild } from '../../../utils/types.js'

  /**
   * `w-full` by default: a select sits in a form field beside inputs that are
   * already full width, and `w-fit` made it the one control in the row not to
   * be. Set `class="w-fit"` back for the rarer case. `size="sm"` for a dense
   * row, such as a table cell or a toolbar.
   */
  export type SelectTriggerProps = WithoutChild<SelectPrimitive.TriggerProps> & {
    size?: 'sm' | 'md'
  }
</script>

<script lang="ts">
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down'

  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    size = 'md',
    class: className,
    children,
    ...rest
  }: SelectTriggerProps = $props()
</script>

<SelectPrimitive.Trigger
  bind:ref
  data-slot="select-trigger"
  data-size={size}
  class={cn(
    "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-input/50 hover:bg-input flex w-full items-center justify-between gap-2 rounded-2xl border border-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=md]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className,
  )}
  {...rest}
>
  {@render children?.()}
  <ChevronDownIcon class="size-4 opacity-70" />
</SelectPrimitive.Trigger>
