<!-- `size="sm"` for a short confirmation with no description: the title says everything needed. -->
<script lang="ts">
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
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
      <Button variant="outline" {...props}>Discard draft</Button>
    {/snippet}
  </AlertDialogTrigger>
  <AlertDialogContent size="sm">
    <AlertDialogHeader>
      <AlertDialogTitle>Discard this draft?</AlertDialogTitle>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Keep editing</AlertDialogCancel>
      <AlertDialogAction tone="critical">Discard</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
