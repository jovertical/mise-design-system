<!--
  A form inside the footer's two-button shape. "Cancel", not "Close": closing
  discards what the operator typed, and Cancel says so.
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
    Field,
    FieldGroup,
    FieldLabel,
    Input,
  } from '@jovertical/mise-design-system'

  let open = $state(false)
  let name = $state('Morning shift')

  function save(event: SubmitEvent) {
    event.preventDefault()

    open = false
  }
</script>

<Button onclick={() => (open = true)}>Rename shift</Button>

<Dialog bind:open>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Rename shift</DialogTitle>
      <DialogDescription>The new name shows on the rota and on receipts.</DialogDescription>
    </DialogHeader>
    <form onsubmit={save} class="grid gap-6">
      <FieldGroup>
        <Field>
          <FieldLabel for="shift-name" required>Shift name</FieldLabel>
          <Input id="shift-name" bind:value={name} required />
        </Field>
      </FieldGroup>
      <DialogFooter>
        <Button type="button" variant="outline" onclick={() => (open = false)}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
