<!--
  Origin: the React package 2.23.0 `empty.tsx` (`EmptyDescription`), itself shadcn/ui new-york `empty`
  Svelte: shadcn-svelte `empty`
  Diverged: none beyond the port. The React divergences from shadcn carry over.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type EmptyDescriptionProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: EmptyDescriptionProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="empty-description"
  class={cn(
    'text-muted-foreground [&>a:hover]:text-primary text-sm [&>a]:underline [&>a]:underline-offset-4',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
