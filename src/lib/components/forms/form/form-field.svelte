<!--
  Origin: the React package 2.23.0 `form.tsx` (`FormItem`), itself shadcn/ui new-york `form`
  Svelte: shadcn-svelte `form`
  Diverged: formsnap's Field for react-hook-form's FormField and FormItem in one:
    it registers `name` on the superforms `form` and draws React's FormItem
    `div`, handing its children the field's value, errors and constraints.
    Ships from the `mise/form` entry, SvelteKit only (round 6 plan, R6-5).
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { FormPath } from 'sveltekit-superforms'

  import type { WithElementRef } from '../../../utils/types.js'
  import type { FormFieldState, FsSuperForm } from './form-types.js'

  /**
   * One field of a superforms form: label, control, description and errors,
   * wired to `name`, so the control is labelled, described and marked invalid
   * from the form's validation. Reach for `Field` directly for a form with no
   * superforms behind it; reach for this where one already is.
   *
   * SvelteKit only: superforms imports `$app/*`, which exists nowhere else.
   */
  export type FormFieldProps<T extends Record<string, unknown>, U extends FormPath<T>> = Omit<
    WithElementRef<HTMLAttributes<HTMLDivElement>>,
    'children'
  > & {
    form: FsSuperForm<T>
    name: U
    children?: Snippet<[FormFieldState<T[U]>]>
  }
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
  import * as FormPrimitive from 'formsnap'

  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    form,
    name,
    class: className,
    children: content,
    ...rest
  }: FormFieldProps<T, U> = $props()
</script>

<FormPrimitive.Field {form} {name}>
  {#snippet children({ constraints, errors, tainted, value })}
    <div bind:this={ref} data-slot="form-item" class={cn('space-y-2', className)} {...rest}>
      {@render content?.({ constraints, errors, tainted, value: value as T[U] })}
    </div>
  {/snippet}
</FormPrimitive.Field>
