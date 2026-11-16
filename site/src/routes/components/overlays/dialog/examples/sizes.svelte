<script lang="ts">
  import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    type DialogSize,
    DialogTitle,
  } from '@jovertical/mise-design-system'

  const SIZES: DialogSize[] = ['sm', 'md', 'lg', 'xl']

  let open = $state(false)
  let size: DialogSize = $state('lg')

  function show(next: DialogSize) {
    size = next

    open = true
  }
</script>

{#each SIZES as option (option)}
  <Button variant="outline" onclick={() => show(option)}>{option}</Button>
{/each}

<Dialog bind:open>
  <DialogContent {size}>
    <DialogHeader>
      <DialogTitle>Size {size}</DialogTitle>
      <DialogDescription>Four widths; lg is the default.</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
