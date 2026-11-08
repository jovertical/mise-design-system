<!--
  Origin: the React package 2.23.0 `form.tsx` (`FormElementField`), itself shadcn/ui new-york `form`
  Svelte: shadcn-svelte `form`
  Diverged: formsnap's ElementField, for one element of an array
    field, drawn as FormField is. Ships from the `mise/form` entry, SvelteKit only (round 6 plan, R6-5).
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { FormPathLeaves } from 'sveltekit-superforms'

  import type { WithElementRef } from '../../../utils/types.js'
  import type { FormFieldState, FsSuperForm } from './form-types.js'

  /** One element of an array field (`tags[0]`), drawn as `FormField` is. */
  export type FormElementFieldProps<
    T extends Record<string, unknown>,
    U extends FormPathLeaves<T>,
  > = Omit<WithElementRef<HTMLAttributes<HTMLDivElement>>, 'children'> & {
    form: FsSuperForm<T>
    name: U
    children?: Snippet<[FormFieldState<T[U]>]>
  }
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPathLeaves<T>">
  import * as FormPrimitive from 'formsnap'

  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    form,
    name,
    class: className,
    children: content,
    ...rest
  }: FormElementFieldProps<T, U> = $props()
</script>

<FormPrimitive.ElementField {form} {name}>
  {#snippet children({ constraints, errors, tainted, value })}
    <div bind:this={ref} data-slot="form-item" class={cn('space-y-2', className)} {...rest}>
      {@render content?.({ constraints, errors, tainted, value: value as T[U] })}
    </div>
  {/snippet}
</FormPrimitive.ElementField>
