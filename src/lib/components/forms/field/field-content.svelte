<!--
  Origin: the React package 2.23.0 `field.tsx` (`FieldContent`), itself shadcn/ui new-york `field`
  Svelte: shadcn-svelte `field`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type FieldContentProps = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: FieldContentProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="field-content"
  class={cn('group/field-content flex flex-1 flex-col gap-1.5 leading-snug', className)}
  {...rest}
>
  {@render children?.()}
</div>
