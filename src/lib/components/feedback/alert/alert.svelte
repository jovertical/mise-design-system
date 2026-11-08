<!--
  Origin: the React package 2.23.0 `alert.tsx` (`Alert`), itself shadcn/ui new-york `alert`
  Svelte: shadcn-svelte `alert`
  Diverged: none beyond the port. The variants live in alert-variants.ts.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'
  import type { AlertVariant } from './alert-variants.js'

  /**
   * Status is the surface and the icon; the words stay in ink. Red body text
   * reads as the message being an error rather than being about one. The
   * layout has an icon column only when there is an icon, and a third column
   * for `AlertAction` from `sm`.
   */
  export type AlertProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    variant?: AlertVariant
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { alertVariants } from './alert-variants.js'

  let { ref = $bindable(null), variant, class: className, children, ...rest }: AlertProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="alert"
  role="alert"
  class={cn(alertVariants({ variant }), className)}
  {...rest}
>
  {@render children?.()}
</div>
