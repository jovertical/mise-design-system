<script module lang="ts">
  // WithForm uses Field without a form library.
  import DownloadIcon from '@lucide/svelte/icons/download'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Button from '../../actions/button/button.svelte'
  import Progress from '../../feedback/progress/progress.svelte'
  import Spinner from '../../feedback/spinner/spinner.svelte'
  import Field from '../../forms/field/field.svelte'
  import FieldDescription from '../../forms/field/field-description.svelte'
  import FieldGroup from '../../forms/field/field-group.svelte'
  import FieldLabel from '../../forms/field/field-label.svelte'
  import Input from '../../forms/input/input.svelte'
  import Dialog from './dialog.svelte'
  import DialogContent from './dialog-content.svelte'
  import DialogDescription from './dialog-description.svelte'
  import DialogFooter from './dialog-footer.svelte'
  import DialogHeader from './dialog-header.svelte'
  import DialogTitle from './dialog-title.svelte'

  const { Story } = defineMeta({
    title: 'Overlays/Dialog',
    component: DialogContent,
    tags: ['shadcn'],
    parameters: { layout: 'centered' },
  })

  const confirm = $state({ open: false })
  const edit = $state({ open: false, saving: false, name: 'Riverside', opens: '06:00' })
  const palette = $state({ open: false })
  const exportJob = $state<{ open: boolean; status: 'idle' | 'generating' | 'done' }>({
    open: false,
    status: 'idle',
  })

  function generate() {
    exportJob.status = 'generating'
    setTimeout(() => {
      if (exportJob.status === 'generating') exportJob.status = 'done'
    }, 2000)
  }

  function closeExport() {
    exportJob.open = false
    exportJob.status = 'idle'
  }

  /** Closing by Escape or an outside click resets the job, the same as Close. */
  function setExportOpen(next: boolean) {
    if (next) exportJob.open = true
    else closeExport()
  }

  function save(event: SubmitEvent) {
    event.preventDefault()
    edit.saving = true
    setTimeout(() => {
      edit.saving = false
      edit.open = false
    }, 800)
  }
</script>

<!--
  `open` bound from outside, not `DialogTrigger`. Most dialogs are opened by
  something other than a button beside them, such as a row action or a keyboard
  shortcut, so the screen owns `open`. `DialogTrigger` is still right for the
  rare case where nothing but a button opens the dialog.

  `args` carries `children`, which the dialog already has; `as object` lets the
  controls through without that clash.
-->
<Story name="Playground">
  {#snippet template(args)}
    <Button onclick={() => (confirm.open = true)}>Close location</Button>
    <Dialog bind:open={confirm.open} {...args as object}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Close the Riverside location?</DialogTitle>
          <DialogDescription>
            This cannot be undone. Orders and stock history stay, but the location can no longer
            take new orders.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onclick={() => (confirm.open = false)}>Cancel</Button>
          <Button tone="critical" onclick={() => (confirm.open = false)}>Close location</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  {/snippet}
</Story>

<!--
  A form inside `DialogFooter`'s two-button shape: the shape every
  edit-in-a-dialog screen uses. Submit saves, then closes the dialog through the
  bound `open`.

  The dismiss button reads "Cancel", not "Close": closing this dialog discards
  whatever the operator typed, and "Cancel" is the word that says so.
-->
<Story name="With form" asChild>
  <Button onclick={() => (edit.open = true)}>Edit location</Button>
  <Dialog bind:open={edit.open}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit location</DialogTitle>
        <DialogDescription>Update the details for this location.</DialogDescription>
      </DialogHeader>
      <form onsubmit={save} class="grid gap-6">
        <FieldGroup>
          <Field>
            <FieldLabel for="location-name" required>Location name</FieldLabel>
            <Input id="location-name" bind:value={edit.name} required disabled={edit.saving} />
            <FieldDescription>Shown on receipts and at the register.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel for="opening-time">Opening time</FieldLabel>
            <Input
              id="opening-time"
              type="time"
              bind:value={edit.opens}
              required
              disabled={edit.saving}
            />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onclick={() => (edit.open = false)}
            disabled={edit.saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={edit.saving}>
            {edit.saving ? 'Updating…' : 'Update location'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</Story>

<!--
  `showCloseButton={false}`, for a surface that is a takeover rather than a
  dialog with a task inside it, like a command palette. Escape and an outside
  click still close it. What is missing is the X in the corner, which would be
  one more affordance beside a search input that already owns the top of the
  surface.
-->
<Story name="Without close button" asChild>
  <Button onclick={() => (palette.open = true)}>Open command palette</Button>
  <Dialog bind:open={palette.open}>
    <DialogContent class="max-w-2xl p-2" showCloseButton={false}>
      <DialogTitle class="sr-only">Search</DialogTitle>
      <Input placeholder="Search orders, stock, locations…" aria-label="Search" />
    </DialogContent>
  </Dialog>
</Story>

<!--
  Start a job, watch it, then download: the shape every export dialog takes. The
  bar has no value, so it draws empty rather than animating; the line under it
  is what says the job is running.

  "Close", not "Cancel": closing the dialog does not stop the job, which keeps
  running and reports when it is done. There is nothing here to cancel.
-->
<Story name="Generate and download" asChild>
  <Button onclick={() => (exportJob.open = true)}>Export stock list</Button>
  <Dialog bind:open={() => exportJob.open, setExportOpen}>
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Export stock list</DialogTitle>
        <DialogDescription>One row per item, with a column for each location.</DialogDescription>
      </DialogHeader>
      {#if exportJob.status === 'generating'}
        <div class="space-y-2">
          <Progress value={undefined} />
          <p class="text-muted-foreground text-sm">
            Building the file. This keeps running if you close the dialog.
          </p>
        </div>
      {:else if exportJob.status === 'done'}
        <p class="text-muted-foreground text-sm">
          1,204 rows written to <span class="font-medium">stock-2026-11-05.csv</span>.
        </p>
      {/if}
      <DialogFooter>
        <Button variant="outline" onclick={closeExport}>Close</Button>
        {#if exportJob.status === 'done'}
          <Button onclick={closeExport}><DownloadIcon />Download</Button>
        {:else}
          <Button onclick={generate} disabled={exportJob.status === 'generating'}>
            {#if exportJob.status === 'generating'}
              <Spinner />
            {/if}
            Generate file
          </Button>
        {/if}
      </DialogFooter>
    </DialogContent>
  </Dialog>
</Story>
