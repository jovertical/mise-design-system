<!--
  Origin: the React package 2.23.0 `alert-dialog.tsx` (`AlertDialogDescription`), itself shadcn/ui new-york `alert-dialog`
  Svelte: shadcn-svelte `alert-dialog`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui'

  export type AlertDialogDescriptionProps = AlertDialogPrimitive.DescriptionProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: AlertDialogDescriptionProps = $props()
</script>

<AlertDialogPrimitive.Description
  bind:ref
  data-slot="alert-dialog-description"
  class={cn('text-muted-foreground text-sm', className)}
  {...rest}
/>
