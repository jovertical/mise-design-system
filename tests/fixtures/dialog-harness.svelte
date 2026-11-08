<script lang="ts">
  import {
    Button,
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '../../src/lib/index.js'

  let {
    open = $bindable(false),
    size,
    showCloseButton,
  }: { open?: boolean; size?: 'sm' | 'md' | 'lg' | 'xl'; showCloseButton?: boolean } = $props()
</script>

<Dialog bind:open>
  <DialogTrigger>
    {#snippet child({ props })}
      <Button {...props}>Close the shift</Button>
    {/snippet}
  </DialogTrigger>
  <DialogContent {size} {showCloseButton}>
    <DialogHeader>
      <DialogTitle>Close the morning shift?</DialogTitle>
      <DialogDescription>Open orders move to the next shift.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose>
        {#snippet child({ props })}
          <Button variant="outline" {...props}>Cancel</Button>
        {/snippet}
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
<output data-testid="open">{open ? 'open' : 'closed'}</output>
