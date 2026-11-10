<!--
  Origin: the React package 2.23.0 `toggle-group.tsx` (`ToggleGroupItem`), itself shadcn/ui new-york `toggle-group`
  Svelte: shadcn-svelte `toggle-group`
  Diverged: none beyond the port. The variant and size come from the group's
    context first, as in React.
-->
<script lang="ts" module>
  import { ToggleGroup as ToggleGroupPrimitive } from 'bits-ui'

  import type { ToggleSize, ToggleVariant } from '../toggle/toggle-variants.js'

  export type ToggleGroupItemProps = ToggleGroupPrimitive.ItemProps & {
    variant?: ToggleVariant
    size?: ToggleSize
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { drawnToggleSize, toggleVariants } from '../toggle/toggle-variants.js'
  import { getToggleGroupContext } from './toggle-group.svelte'

  let {
    ref = $bindable(null),
    variant,
    size,
    class: className,
    ...rest
  }: ToggleGroupItemProps = $props()

  const context = getToggleGroupContext()
  const resolvedVariant = $derived(context?.variant || variant)
  const resolvedSize = $derived(drawnToggleSize(context?.size || size))

  // The joined-border rules square off the inner edges of adjacent options so
  // the group reads as one control. A segmented option is a pill floating in a
  // track, so squaring its corners would draw the seam the track exists to avoid.
  const joined = $derived(
    resolvedVariant === 'segmented'
      ? ''
      : 'data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first:rounded-l-md data-[spacing=0]:last:rounded-r-md data-[spacing=0]:data-[variant=outline]:border-l-0 data-[spacing=0]:data-[variant=outline]:first:border-l',
  )
</script>

<ToggleGroupPrimitive.Item
  bind:ref
  data-slot="toggle-group-item"
  data-variant={resolvedVariant}
  data-size={resolvedSize}
  data-spacing={context?.spacing}
  class={cn(
    toggleVariants({ variant: resolvedVariant, size: resolvedSize }),
    'w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10',
    resolvedVariant === 'segmented' &&
      'data-[size=sm]:px-2 data-[size=sm]:text-xs data-[size=lg]:px-4 data-[size=lg]:text-sm',
    joined,
    className,
  )}
  {...rest}
/>
