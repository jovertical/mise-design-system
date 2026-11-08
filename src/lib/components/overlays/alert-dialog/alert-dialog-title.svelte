<!--
  Origin: the React package 2.23.0 `alert-dialog.tsx` (`AlertDialogTitle`), itself shadcn/ui new-york `alert-dialog`
  Svelte: shadcn-svelte `alert-dialog`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui'

  export type AlertDialogTitleProps = AlertDialogPrimitive.TitleProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: AlertDialogTitleProps = $props()
</script>

<AlertDialogPrimitive.Title
  bind:ref
  data-slot="alert-dialog-title"
  class={cn(
    'text-lg font-semibold sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2',
    className,
  )}
  {...rest}
/>
