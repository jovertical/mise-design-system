<!--
  The screen owns `open`: most dialogs are opened by something other than a
  button beside them (a row action, a shortcut), so `DialogTrigger` is rare.
-->
<script lang="ts">
  import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@jovertical/mise-design-system'

  let open = $state(false)
</script>

<Button variant="outline" onclick={() => (open = true)}>Close location</Button>

<Dialog bind:open>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Close Sta Cruz for the day?</DialogTitle>
      <DialogDescription>Open orders move to tomorrow's first shift.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
      <Button tone="critical" onclick={() => (open = false)}>Close location</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
