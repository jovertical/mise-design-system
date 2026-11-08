<!--
  Origin: the React package 2.23.0 `alert-dialog.tsx` (`AlertDialogCancel`), itself shadcn/ui new-york `alert-dialog`
  Svelte: shadcn-svelte `alert-dialog`
  Diverged: Button's `asChild` becomes the primitive's `child` snippet rendering
    a Button; the props merge as Radix's Slot merged them.
-->
<script lang="ts" module>
  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui'
  import type { WithoutChild } from '../../../utils/types.js'
  import type { ButtonProps } from '../../actions/button/button.svelte'

  export type AlertDialogCancelProps = WithoutChild<AlertDialogPrimitive.CancelProps> &
    Pick<ButtonProps, 'variant' | 'size'>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import Button from '../../actions/button/button.svelte'

  let {
    ref = $bindable(null),
    variant = 'outline',
    size = 'md',
    class: className,
    children,
    ...rest
  }: AlertDialogCancelProps = $props()
</script>

<AlertDialogPrimitive.Cancel bind:ref data-slot="alert-dialog-cancel" {...rest}>
  {#snippet child({ props })}
    <Button {variant} {size} {...props} class={cn(className)}> {@render children?.()} </Button>
  {/snippet}
</AlertDialogPrimitive.Cancel>
