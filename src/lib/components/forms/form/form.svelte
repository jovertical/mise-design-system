<!--
  Origin: the React package 2.23.0 `form.tsx` (`Form`), itself shadcn/ui new-york `form`
  Svelte: shadcn-svelte `form`
  Diverged: React's Form was react-hook-form's FormProvider, the context its
    fields read. superforms needs no provider (each FormField takes the `form`),
    so Form is the `<form>` element with superforms' `enhance` applied and
    `method="POST"`, the one piece every superforms form repeats. shadcn-svelte
    has no such part. Ships from the `mise/form` entry, SvelteKit only (round 6
    plan, R6-5).
-->
<script lang="ts" module>
  import type { HTMLFormAttributes } from 'svelte/elements'
  import type { SuperForm } from 'sveltekit-superforms'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * The `<form>` around a superforms form: `method="POST"` and superforms'
   * `enhance`, so submitting validates on the client and posts to the page's
   * action, or stays in the browser in SPA mode.
   *
   * SvelteKit only: superforms imports `$app/*`, which exists nowhere else.
   * Reach for `Field` directly for a form with no superforms behind it.
   */
  export type FormProps<T extends Record<string, unknown>> = WithElementRef<HTMLFormAttributes> & {
    form: SuperForm<T>
  }
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
  let { ref = $bindable(null), form, method = 'POST', children, ...rest }: FormProps<T> = $props()

  const enhance = $derived(form.enhance)
</script>

<form bind:this={ref} {method} data-slot="form" use:enhance {...rest}>
  {@render children?.()}
</form>
