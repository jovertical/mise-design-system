<!--
  Origin: the React package 2.23.0 `dialog.tsx` (`DialogClose`), itself shadcn/ui new-york `dialog`
  Svelte: shadcn-svelte `dialog`
  Diverged: `asChild` is bits-ui's `child` snippet.
-->
<script lang="ts" module>
  import { Dialog as DialogPrimitive } from 'bits-ui'

  export type DialogCloseProps = DialogPrimitive.CloseProps
</script>

<script lang="ts">
  let { ref = $bindable(null), ...rest }: DialogCloseProps = $props()
</script>

<DialogPrimitive.Close bind:ref data-slot="dialog-close" {...rest} />
