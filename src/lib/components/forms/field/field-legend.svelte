<!--
  Origin: the React package 2.23.0 `field.tsx` (`FieldLegend`), itself shadcn/ui new-york `field`
  Svelte: shadcn-svelte `field`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type FieldLegendProps = WithElementRef<
    HTMLAttributes<HTMLLegendElement>,
    HTMLLegendElement
  > & {
    variant?: 'legend' | 'label'
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    variant = 'legend',
    class: className,
    children,
    ...rest
  }: FieldLegendProps = $props()
</script>

<legend
  bind:this={ref}
  data-slot="field-legend"
  data-variant={variant}
  class={cn(
    'mb-3 font-medium',
    'data-[variant=legend]:text-base',
    'data-[variant=label]:text-sm',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</legend>
