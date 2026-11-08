<!--
  Origin: the React package 2.23.0 `field.tsx` (`FieldSeparator`), itself shadcn/ui new-york `field`
  Svelte: shadcn-svelte `field`
  Diverged: the label in the middle is the children snippet.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type FieldSeparatorProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import Separator from '../../layout/separator/separator.svelte'

  let { ref = $bindable(null), class: className, children, ...rest }: FieldSeparatorProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="field-separator"
  data-content={!!children}
  class={cn('relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2', className)}
  {...rest}
>
  <Separator class="absolute inset-0 top-1/2" />
  {#if children}
    <span
      class="bg-background text-muted-foreground relative mx-auto block w-fit px-2"
      data-slot="field-separator-content"
    >
      {@render children()}
    </span>
  {/if}
</div>
