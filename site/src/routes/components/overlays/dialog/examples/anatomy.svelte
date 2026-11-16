<!--
  Open on the page, for the anatomy: no portal, so it renders inside the
  stage; and none of a modal's hold on the page (taking focus on open, a
  focus trap, scroll lock, closing on Escape or an outside click), so the docs
  stay usable around it.
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
</script>

<Dialog open>
  <DialogContent
    size="md"
    portalProps={{ disabled: true }}
    onOpenAutoFocus={(event) => event.preventDefault()}
    trapFocus={false}
    preventScroll={false}
    interactOutsideBehavior="ignore"
    escapeKeydownBehavior="ignore"
  >
    <DialogHeader>
      <DialogTitle>Close Sta Cruz for the day?</DialogTitle>
      <DialogDescription>Open orders move to tomorrow's first shift.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button tone="critical">Close location</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
