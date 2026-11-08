<!--
  Origin: the React package 2.23.0 `input-group.tsx` (`InputGroup`), itself shadcn/ui new-york `input-group`
  Svelte: shadcn-svelte `input-group`
  Diverged: none beyond the port. The React divergences from shadcn carry over.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * The surface matches `Input` exactly: filled, a transparent border,
   * rounded-2xl. Stock shadcn draws a bordered white box at rounded-md, which
   * put every grouped field out of step with the plain inputs beside it.
   */
  export type InputGroupProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: InputGroupProps = $props()
</script>

<!-- biome-ignore lint/a11y/useSemanticElements: a styling wrapper carrying a grouping role, as upstream; no semantic element covers it -->
<div
  bind:this={ref}
  data-slot="input-group"
  role="group"
  class={cn(
    'group/input-group bg-input/50 relative flex w-full items-center rounded-2xl border border-transparent shadow-xs transition-[color,box-shadow] outline-none',
    'h-9 min-w-0 has-[>textarea]:h-auto',
    'has-[>[data-align=inline-start]]:[&>input]:pl-2',
    'has-[>[data-align=inline-end]]:[&>input]:pr-2',
    'has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3',
    'has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3',
    'has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]',
    'has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
