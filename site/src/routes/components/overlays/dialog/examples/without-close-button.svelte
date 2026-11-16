<!--
  A takeover rather than a task, like a search: no X in the corner, since the
  input already owns the top of the surface. Escape and an outside click
  still close it.
-->
<script lang="ts">
  import { Button, Dialog, DialogContent, DialogTitle, Input } from '@jovertical/mise-design-system'

  let open = $state(false)
</script>

<Button variant="outline" onclick={() => (open = true)}>Search stock</Button>

<Dialog bind:open>
  <DialogContent class="max-w-2xl p-2" showCloseButton={false}>
    <DialogTitle class="sr-only">Search stock</DialogTitle>
    <Input placeholder="Search items, locations, orders…" aria-label="Search stock" />
  </DialogContent>
</Dialog>
