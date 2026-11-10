<!--
  Origin: the React package 2.23.0 `separator.tsx`, itself shadcn/ui new-york `separator`
  Svelte: shadcn-svelte `separator`
  Diverged: unaudited, as in the React package. bits-ui Separator for Radix Separator.
    A vertical rule stretches to its row (`self-stretch`) rather than taking
    `h-full`, whose attribute selector outranked a caller's `h-4`, so a short
    divider in a toolbar is just `class="h-4"` (bertos-bakery-ops' audit,
    2026-11-10).
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
    'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:self-stretch data-[orientation=vertical]:w-px',
    className,
  )}
  {...rest}
/>
