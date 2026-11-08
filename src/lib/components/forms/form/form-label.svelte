<!--
  Origin: the React package 2.23.0 `form.tsx` (`FormLabel`), itself shadcn/ui new-york `form`
  Svelte: shadcn-svelte `form`
  Diverged: formsnap's Label, drawn as FieldLabel: React's `required`
    asterisk, with FieldLabel's sr-only "(required)" beside it. It turns red
    on formsnap's `data-fs-error`, where React read react-hook-form's error.
    Ships from the `mise/form` entry, SvelteKit only (round 6 plan, R6-5).
-->
<script lang="ts" module>
  import type * as FormPrimitive from 'formsnap'

  import type { WithoutChild } from '../../../utils/types.js'

  /** The field's label, pointed at its control and red while the field is invalid. */
  export type FormLabelProps = WithoutChild<FormPrimitive.LabelProps> & {
    /** Adds the asterisk that marks a mandatory field. */
    required?: boolean
  }
</script>

<script lang="ts">
  import * as FormPrimitiveRuntime from 'formsnap'

  import { cn } from '../../../utils/cn.js'
  import FieldLabel from '../field/field-label.svelte'

  let {
    ref = $bindable(null),
    required = false,
    class: className,
    children,
    ...rest
  }: FormLabelProps = $props()
</script>

<FormPrimitiveRuntime.Label bind:ref {...rest}>
  {#snippet child({ props })}
    <FieldLabel
      {...props}
      {required}
      data-slot="form-label"
      class={cn('data-[fs-error]:text-destructive', className)}
    >
      {@render children?.()}
    </FieldLabel>
  {/snippet}
</FormPrimitiveRuntime.Label>
