<script lang="ts">
  import { Checkbox, Label } from '@jovertical/mise-design-system'

  let done = $state(false)
</script>

<div class="flex items-center gap-2">
  <Checkbox id="count-done" bind:checked={done} />
  <Label for="count-done">Stock count done</Label>
</div>
