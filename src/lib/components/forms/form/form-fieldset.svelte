<!--
  Origin: the React package 2.23.0 `form.tsx` (`FormFieldset`), itself shadcn/ui new-york `form`
  Svelte: shadcn-svelte `form`
  Diverged: formsnap's Fieldset, for a group of controls under one
    name (a radio group, a set of checkboxes). Ships from the `mise/form` entry, SvelteKit only (round 6 plan, R6-5).
-->
<script lang="ts" module>
  import type * as FormPrimitive from 'formsnap'
  import type { FormPath } from 'sveltekit-superforms'

  import type { WithoutChild } from '../../../utils/types.js'

  /** A group of controls under one name, captioned by `FormLegend`. */
  export type FormFieldsetProps<
    T extends Record<string, unknown>,
    U extends FormPath<T>,
  > = WithoutChild<FormPrimitive.FieldsetProps<T, U>>
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
  import * as FormPrimitiveRuntime from 'formsnap'

  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    form,
    name,
    class: className,
    ...rest
  }: FormFieldsetProps<T, U> = $props()
</script>

<FormPrimitiveRuntime.Fieldset
  bind:ref
  {form}
  {name}
  data-slot="form-fieldset"
  class={cn('space-y-2', className)}
  {...rest}
/>
