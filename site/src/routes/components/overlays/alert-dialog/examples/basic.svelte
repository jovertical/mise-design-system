<!--
  A confirmation the operator cannot dismiss by clicking outside it, for an
  action that is destructive or hard to undo. Everything else wants Dialog.
-->
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
  } from '@jovertical/mise-design-system'
</script>

<AlertDialog>
  <AlertDialogTrigger>
    {#snippet child({ props })}
      <Button variant="outline" {...props}>Close location</Button>
    {/snippet}
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Close Riverside?</AlertDialogTitle>
      <AlertDialogDescription>
        This cannot be undone. 398 units across 22 items will need to be moved first.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction tone="critical">Close location</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
