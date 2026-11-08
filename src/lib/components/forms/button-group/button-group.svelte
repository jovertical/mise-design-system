<!--
  Origin: the React package 2.23.0 `button-group.tsx` (`ButtonGroup`), itself shadcn/ui new-york `button-group`
  Svelte: shadcn-svelte `button-group`
  Diverged: unaudited, as in the React package. `orientation` defaults to
    `horizontal` on `data-orientation` too, where React leaves it unset.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'
  import type { ButtonGroupOrientation } from './button-group-variants.js'

  /**
   * Adjacent controls that share one edge instead of each carrying its own
   * radius and gap: a segmented set of buttons, or two buttons and the input
   * they act on, read as one control.
   */
  export type ButtonGroupProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    orientation?: ButtonGroupOrientation
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { buttonGroupVariants } from './button-group-variants.js'

  let {
    ref = $bindable(null),
    orientation = 'horizontal',
    class: className,
    children,
    ...rest
  }: ButtonGroupProps = $props()
</script>

<!-- biome-ignore lint/a11y/useSemanticElements: upstream shadcn markup. The element is a styling wrapper carrying a role for grouping, not a landmark, and no semantic element covers it -->
<div
  bind:this={ref}
  role="group"
  data-slot="button-group"
  data-orientation={orientation}
  class={cn(buttonGroupVariants({ orientation }), className)}
  {...rest}
>
  {@render children?.()}
</div>
