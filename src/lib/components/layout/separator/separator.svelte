<!--
  Origin: the React package 2.23.0 `separator.tsx`, itself shadcn/ui new-york `separator`
  Svelte: shadcn-svelte `separator`
  Diverged: unaudited, as in the React package. bits-ui Separator for Radix Separator.
-->
<script lang="ts" module>
  import { Separator as SeparatorPrimitive } from 'bits-ui'

  export type SeparatorProps = SeparatorPrimitive.RootProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    orientation = 'horizontal',
    decorative = true,
    ref = $bindable(null),
    class: className,
    ...rest
  }: SeparatorProps = $props()
</script>

<SeparatorPrimitive.Root
  bind:ref
  data-slot="separator"
  {decorative}
  {orientation}
  class={cn(
    'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
    className,
  )}
  {...rest}
/>
