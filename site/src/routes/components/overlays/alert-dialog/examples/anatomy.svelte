<!--
  Open on the page, for the anatomy: no portal, so it renders in the stage,
  and none of its hold on the page (focus taken, a trap, scroll lock, Escape).
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
  } from '@jovertical/mise-design-system'
</script>

<AlertDialog open>
  <AlertDialogContent
    portalProps={{ disabled: true }}
    onOpenAutoFocus={(event) => event.preventDefault()}
    trapFocus={false}
    preventScroll={false}
    escapeKeydownBehavior="ignore"
  >
    <AlertDialogHeader>
      <AlertDialogTitle>Close Riverside?</AlertDialogTitle>
      <AlertDialogDescription
        >398 units across 22 items will need to be moved first.</AlertDialogDescription
      >
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction tone="critical">Close location</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
