<!--
  Origin: the React package 2.23.0 `alert-dialog.tsx` (`AlertDialogAction`), itself shadcn/ui new-york `alert-dialog`
  Svelte: shadcn-svelte `alert-dialog`
  Diverged: Button's `asChild` becomes the primitive's `child` snippet rendering
    a Button; the props merge as Radix's Slot merged them. bits-ui's Action does
    not close the dialog and Radix's did, so this closes it after `onclick`
    unless the handler calls `event.preventDefault()`, as Radix allowed.
-->
<script lang="ts" module>
  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui'
  import type { WithoutChild } from '../../../utils/types.js'
  import type { ButtonProps } from '../../actions/button/button.svelte'

  export type AlertDialogActionProps = WithoutChild<AlertDialogPrimitive.ActionProps> &
    Pick<ButtonProps, 'variant' | 'tone' | 'size'>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import Button from '../../actions/button/button.svelte'
  import { getAlertDialogClose } from './alert-dialog.svelte'

  let {
    ref = $bindable(null),
    variant = 'solid',
    tone,
    size = 'md',
    class: className,
    children,
    onclick,
    ...rest
  }: AlertDialogActionProps = $props()

  const close = getAlertDialogClose()

  function act(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
    onclick?.(event)

    if (event.defaultPrevented) return

    close?.()
  }
</script>

<AlertDialogPrimitive.Action bind:ref data-slot="alert-dialog-action" onclick={act} {...rest}>
  {#snippet child({ props })}
    <Button {variant} {tone} {size} {...props} class={cn(className)}>
      {@render children?.()}
    </Button>
  {/snippet}
</AlertDialogPrimitive.Action>
