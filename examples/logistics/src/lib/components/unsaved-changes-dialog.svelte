<!-- Asks before a navigation throws a dirty form away; the guard in entityForm waits on it. -->
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
  } from '@jovertical/mise-design-system'

  import { answerDiscard, discard } from '#lib/entity-form.svelte.js'
</script>

<AlertDialog
  open={discard.open}
  onOpenChange={(open) => {
    if (!open && discard.resolve) answerDiscard(false)
  }}
>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Discard changes?</AlertDialogTitle>
      <AlertDialogDescription>Your changes haven't been saved.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel onclick={() => answerDiscard(false)}>Keep editing</AlertDialogCancel>
      <AlertDialogAction tone="critical" onclick={() => answerDiscard(true)}>
        Discard
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
