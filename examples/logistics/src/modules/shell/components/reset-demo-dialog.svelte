<!-- Confirms, then puts every collection back to the seed and forgets the saved copy. -->
<script lang="ts">
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    toast,
  } from '@jovertical/mise-design-system'

  import { store } from '#modules/core/data/store.svelte.js'

  let { open = $bindable(false) }: { open?: boolean } = $props()

  function reset() {
    store.reset()

    toast.success('Demo data reset')
  }
</script>

<AlertDialog bind:open>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Reset the demo?</AlertDialogTitle>
      <AlertDialogDescription>
        Every order, product, client and setting you changed goes back to how the demo started.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Keep my changes</AlertDialogCancel>
      <AlertDialogAction onclick={reset}>Reset demo data</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
