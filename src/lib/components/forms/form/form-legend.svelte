<!--
  Origin: the React package 2.23.0 `form.tsx` (`FormLegend`), itself shadcn/ui new-york `form`
  Svelte: shadcn-svelte `form`
  Diverged: formsnap's Legend, which React's form had none of; classes from shadcn-svelte. Ships from the `mise/form` entry, SvelteKit only (round 6 plan, R6-5).
-->
<script lang="ts" module>
  import type * as FormPrimitive from 'formsnap'

  import type { WithoutChild } from '../../../utils/types.js'

  /** The caption of a `FormFieldset`, red while the group is invalid. */
  export type FormLegendProps = WithoutChild<FormPrimitive.LegendProps>
</script>

<script lang="ts">
  import * as FormPrimitiveRuntime from 'formsnap'

  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: FormLegendProps = $props()
</script>

<FormPrimitiveRuntime.Legend
  bind:ref
  data-slot="form-legend"
  class={cn('text-sm leading-none font-medium data-[fs-error]', className)}
  {...rest}
/>
