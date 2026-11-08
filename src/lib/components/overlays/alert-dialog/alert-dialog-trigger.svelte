<!--
  Origin: the React package 2.23.0 `alert-dialog.tsx` (`AlertDialogTrigger`), itself shadcn/ui new-york `alert-dialog`
  Svelte: shadcn-svelte `alert-dialog`
  Diverged: `asChild` is bits-ui's `child` snippet.
-->
<script lang="ts" module>
  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui'

  export type AlertDialogTriggerProps = AlertDialogPrimitive.TriggerProps
</script>

<script lang="ts">
  let { ref = $bindable(null), ...rest }: AlertDialogTriggerProps = $props()
</script>

<AlertDialogPrimitive.Trigger bind:ref data-slot="alert-dialog-trigger" {...rest} />
