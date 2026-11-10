<!--
  Origin: the React package 2.23.0 `toggle.tsx`, itself shadcn/ui new-york `toggle`
  Svelte: shadcn-svelte `toggle`
  Diverged: bits-ui Toggle for Radix Toggle, with `bind:pressed`. The React
    divergences from shadcn (`segmented`, `solid`, `iconOnly`, size before
    variant) carry over in toggle-variants.ts. `md` is accepted for the middle size and drawn as `default`, so docs and
    stories write mise's `sm | md | lg` (bertos-bakery-ops' audit, 2026-11-10).
-->
<script lang="ts" module>
  import { Toggle as TogglePrimitive } from 'bits-ui'

  import type { ToggleSize, ToggleVariant } from './toggle-variants.js'

  /**
   * One on/off control, not a group: reach for `ToggleGroup` the moment a
   * second option joins it. `variant="segmented"` only makes sense inside that
   * group's track; a lone `Toggle` wants `default`, `outline` or `solid`.
   */
  export type ToggleProps = TogglePrimitive.RootProps & {
    variant?: ToggleVariant
    size?: ToggleSize
    /** One glyph and no label: a circle the size of the toggle's height. Needs an `aria-label`. */
    iconOnly?: boolean
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { drawnToggleSize, toggleVariants } from './toggle-variants.js'

  let {
    ref = $bindable(null),
    pressed = $bindable(false),
    variant,
    size,
    iconOnly,
    class: className,
    ...rest
  }: ToggleProps = $props()
</script>

<TogglePrimitive.Root
  bind:ref
  bind:pressed
  data-slot="toggle"
  data-icon-only={iconOnly || undefined}
  class={cn(toggleVariants({ variant, size: drawnToggleSize(size), iconOnly }), className)}
  {...rest}
/>
