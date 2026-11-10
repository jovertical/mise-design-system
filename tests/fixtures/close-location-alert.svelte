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
    AlertDialogTrigger,
    Button,
  } from '../../src/lib/index.js'

  let {
    open = $bindable(false),
    confirmed = $bindable(false),
    holdOpen = false,
  }: { open?: boolean; confirmed?: boolean; holdOpen?: boolean } = $props()

  function confirm(event: MouseEvent) {
    confirmed = true

    if (holdOpen) event.preventDefault()
  }
</script>

<AlertDialog bind:open>
  <AlertDialogTrigger>
    {#snippet child({ props })}
      <Button variant="outline" {...props}>Close location</Button>
    {/snippet}
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Close Riverside?</AlertDialogTitle>
      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction tone="critical" onclick={confirm}>Close it</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
<output data-testid="state">{open ? 'open' : 'closed'} {confirmed ? 'confirmed' : ''}</output>
