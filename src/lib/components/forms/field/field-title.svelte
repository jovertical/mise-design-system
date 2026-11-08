<!--
  Origin: the React package 2.23.0 `field.tsx` (`FieldTitle`), itself shadcn/ui new-york `field`
  Svelte: shadcn-svelte `field`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type FieldTitleProps = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: FieldTitleProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="field-label"
  class={cn(
    'flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
