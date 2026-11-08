<!--
  Origin: the React package 2.23.0 `form.tsx`, itself shadcn/ui new-york `form`
  Svelte: shadcn-svelte `form`
  Diverged: a submit Button, which React's form had none of. Ships from the `mise/form` entry, SvelteKit only (round 6 plan, R6-5).
-->
<script lang="ts" module>
  import type { ButtonProps } from '../../actions/button/button.svelte'

  /** The form's submit button: a `Button` with `type="submit"`. */
  export type FormButtonProps = ButtonProps
</script>

<script lang="ts">
  import Button from '../../actions/button/button.svelte'

  let { ref = $bindable(null), ...rest }: FormButtonProps = $props()
</script>

<Button bind:ref type="submit" {...rest} />
