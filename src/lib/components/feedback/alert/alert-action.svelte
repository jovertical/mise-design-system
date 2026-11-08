<!--
  Origin: the React package 2.23.0 `alert.tsx` (`AlertAction`), itself shadcn/ui new-york `alert`
  Svelte: shadcn-svelte `alert`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * What the alert asks the reader to do: one button or a short row of them. On
   * the right, centred across the title and description, from `sm`; below the
   * text on a phone, where a third column would squeeze the sentence.
   */
  export type AlertActionProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: AlertActionProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="alert-action"
  class={cn(
    'col-start-2 mt-2 flex flex-wrap items-center gap-2 justify-self-start',
    'sm:col-start-3 sm:row-span-2 sm:row-start-1 sm:mt-0 sm:ml-4 sm:self-center sm:justify-self-end',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
