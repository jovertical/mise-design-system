<!--
  Origin: the React package 2.23.0 `form.tsx` (`FormMessage`), itself shadcn/ui new-york `form`
  Svelte: shadcn-svelte `form`
  Diverged: formsnap's FieldErrors for React's FormMessage: one line per
    error, where React showed the first. Children, when given, render the
    errors themselves. Ships from the `mise/form` entry, SvelteKit only (round 6 plan, R6-5).
-->
<script lang="ts" module>
  import type * as FormPrimitive from 'formsnap'

  import type { WithoutChild } from '../../../utils/types.js'

  /** The field's validation errors, linked to the control, nothing while it is valid. */
  export type FormFieldErrorsProps = WithoutChild<FormPrimitive.FieldErrorsProps> & {
    errorClasses?: string | null
  }
</script>

<script lang="ts">
  import * as FormPrimitiveRuntime from 'formsnap'

  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    errorClasses,
    class: className,
    children: content,
    ...rest
  }: FormFieldErrorsProps = $props()
</script>

<FormPrimitiveRuntime.FieldErrors
  bind:ref
  data-slot="form-field-errors"
  class={cn('text-destructive text-sm font-medium', className)}
  {...rest}
>
  {#snippet children({ errors, errorProps })}
    {#if content}
      {@render content({ errors, errorProps })}
    {:else}
      {#each errors as error (error)}
        <div {...errorProps} class={cn(errorClasses)}>{error}</div>
      {/each}
    {/if}
  {/snippet}
</FormPrimitiveRuntime.FieldErrors>
