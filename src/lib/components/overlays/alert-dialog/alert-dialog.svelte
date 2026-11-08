<!--
  Origin: the React package 2.23.0 `alert-dialog.tsx` (`AlertDialog`), itself shadcn/ui new-york `alert-dialog`
  Svelte: shadcn-svelte `alert-dialog`
  Diverged: bits-ui AlertDialog for Radix, with `bind:open`. It shares a
    `close()` through context so AlertDialogAction can close as Radix's did.
-->
<script lang="ts" module>
  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui'
  import { getContext, setContext } from 'svelte'

  const CLOSE = Symbol('alert-dialog-close')

  /** The enclosing AlertDialog's close, for AlertDialogAction. */
  export function getAlertDialogClose(): (() => void) | undefined {
    return getContext<(() => void) | undefined>(CLOSE)
  }

  /**
   * For a confirmation the operator cannot dismiss by clicking outside it:
   * `Dialog` closes on an outside click, this does not. Reach for it when the
   * action is destructive or hard to undo; everything else wants `Dialog`.
   */
  export type AlertDialogProps = AlertDialogPrimitive.RootProps
</script>

<script lang="ts">
  let { open = $bindable(false), ...rest }: AlertDialogProps = $props()

  setContext(CLOSE, () => {
    open = false
  })
</script>

<AlertDialogPrimitive.Root bind:open {...rest} />
