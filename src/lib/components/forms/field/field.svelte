<!--
  Origin: the React package 2.23.0 `field.tsx` (`Field`), itself shadcn/ui new-york `field`
  Svelte: shadcn-svelte `field`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'
  import type { FieldOrientation } from './field-variants.js'

  /**
   * One control with its label, description and error. `horizontal` puts the
   * label beside the control; `responsive` does so from the field group's `md`
   * container width.
   */
  export type FieldProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    orientation?: FieldOrientation
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { fieldVariants } from './field-variants.js'

  let {
    ref = $bindable(null),
    orientation = 'vertical',
    class: className,
    children,
    ...rest
  }: FieldProps = $props()
</script>

<!-- biome-ignore lint/a11y/useSemanticElements: a styling wrapper carrying a grouping role, as upstream -->
<div
  bind:this={ref}
  role="group"
  data-slot="field"
  data-orientation={orientation}
  class={cn(fieldVariants({ orientation }), className)}
  {...rest}
>
  {@render children?.()}
</div>
