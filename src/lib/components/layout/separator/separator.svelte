<!--
  Origin: the React package 2.23.0 `separator.tsx`, itself shadcn/ui new-york `separator`
  Svelte: shadcn-svelte `separator`
  Diverged: unaudited, as in the React package. bits-ui Separator for Radix Separator.
    The orientation's size is chosen here as plain classes rather than
    `data-[orientation=…]:` ones, whose attribute selector outranked a
    caller's `h-4`; now the caller's class replaces it, so a short divider in
    a toolbar is just `class="h-4"` (bertos-bakery-ops' audit, 2026-11-10).
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

  const SIZE = { horizontal: 'h-px w-full', vertical: 'h-full w-px' } as const
</script>

<SeparatorPrimitive.Root
  bind:ref
  data-slot="separator"
  {decorative}
  {orientation}
  class={cn('bg-border shrink-0', SIZE[orientation], className)}
  {...rest}
/>
