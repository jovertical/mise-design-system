<!--
  Origin: the React package 2.23.0 `field.tsx` (`FieldGroup`), itself shadcn/ui new-york `field`
  Svelte: shadcn-svelte `field`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type FieldGroupProps = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: FieldGroupProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="field-group"
  class={cn(
    'group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
