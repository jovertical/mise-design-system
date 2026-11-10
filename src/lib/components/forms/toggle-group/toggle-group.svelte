<!--
  Origin: the React package 2.23.0 `toggle-group.tsx` (`ToggleGroup`), itself shadcn/ui new-york `toggle-group`
  Svelte: shadcn-svelte `toggle-group`
  Diverged: bits-ui ToggleGroup for Radix, with `bind:value`. React's context
    becomes Svelte context with getters, so items follow a group whose props
    change. The `segmented` variant carries over from React.
-->
<script lang="ts" module>
  import { ToggleGroup as ToggleGroupPrimitive } from 'bits-ui'
  import { getContext, setContext } from 'svelte'

  import type { ToggleSize, ToggleVariant } from '../toggle/toggle-variants.js'

  interface ToggleGroupContext {
    readonly variant: ToggleVariant | undefined
    readonly size: ToggleSize | undefined
    readonly spacing: number
  }

  const CONTEXT = Symbol('toggle-group')

  export function getToggleGroupContext(): ToggleGroupContext | undefined {
    return getContext<ToggleGroupContext | undefined>(CONTEXT)
  }

  /**
   * A segmented group is a track, not a row of joined buttons: no gap between
   * options, no shared border to collapse, and the wash is the point. `size`
   * sizes the track, because a segmented item measures itself against it.
   */
  export type ToggleGroupProps = ToggleGroupPrimitive.RootProps & {
    variant?: ToggleVariant
    size?: ToggleSize
    spacing?: number
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { segmentedTrack } from '../../../utils/segmented-control.js'
  import { drawnToggleSize } from '../toggle/toggle-variants.js'

  let {
    ref = $bindable(null),
    value = $bindable(),
    variant,
    size,
    spacing = 0,
    class: className,
    ...rest
  }: ToggleGroupProps = $props()

  setContext<ToggleGroupContext>(CONTEXT, {
    get variant() {
      return variant
    },
    get size() {
      return size
    },
    get spacing() {
      return spacing
    },
  })

  const group = $derived(
    variant === 'segmented'
      ? cn(segmentedTrack, 'data-[size=sm]:h-6 data-[size=lg]:h-9')
      : 'flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=default]:data-[variant=outline]:shadow-xs',
  )
</script>

<!-- bits-ui types value per `type`; destructuring for bind loses that union. -->
<ToggleGroupPrimitive.Root
  bind:ref
  bind:value={value as never}
  data-slot="toggle-group"
  data-variant={variant}
  data-size={drawnToggleSize(size)}
  data-spacing={spacing}
  style="--gap: {spacing}"
  class={cn('group/toggle-group', group, className)}
  {...rest}
/>
