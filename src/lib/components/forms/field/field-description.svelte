<!--
  Origin: the React package 2.23.0 `field.tsx` (`FieldDescription`), itself shadcn/ui new-york `field`
  Svelte: shadcn-svelte `field`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type FieldDescriptionProps = WithElementRef<
    HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: FieldDescriptionProps = $props()
</script>

<p
  bind:this={ref}
  data-slot="field-description"
  class={cn(
    'text-muted-foreground text-sm leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance',
    'last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5',
    '[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</p>
