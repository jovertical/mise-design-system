<!--
  Origin: the React package 2.23.0 `dialog.tsx` (`Dialog`), itself shadcn/ui new-york `dialog`
  Svelte: shadcn-svelte `dialog`
  Diverged: bits-ui Dialog for Radix Dialog. `open` is bindable.
-->
<script lang="ts" module>
  import { Dialog as DialogPrimitive } from 'bits-ui'

  export type DialogProps = DialogPrimitive.RootProps
</script>

<script lang="ts">
  let { open = $bindable(false), ...rest }: DialogProps = $props()
</script>

<DialogPrimitive.Root bind:open {...rest} />
