<!--
  Origin: the React package 2.23.0 `form.tsx` (`FormDescription`), itself shadcn/ui new-york `form`
  Svelte: shadcn-svelte `form`
  Diverged: formsnap's Description, which takes its id from the field. Ships from the `mise/form` entry, SvelteKit only (round 6 plan, R6-5).
-->
<script lang="ts" module>
  import type * as FormPrimitive from 'formsnap'

  import type { WithoutChild } from '../../../utils/types.js'

  /** The line under a field, which formsnap links to the control with `aria-describedby`. */
  export type FormDescriptionProps = WithoutChild<FormPrimitive.DescriptionProps>
</script>

<script lang="ts">
  import * as FormPrimitiveRuntime from 'formsnap'

  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: FormDescriptionProps = $props()
</script>

<FormPrimitiveRuntime.Description
  bind:ref
  data-slot="form-description"
  class={cn('text-muted-foreground text-sm', className)}
  {...rest}
/>
