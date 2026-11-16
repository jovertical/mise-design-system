<!-- Bare: pair it with a Label when the switch needs words beside it. -->
<script lang="ts">
  import { Label, Switch } from '@jovertical/mise-design-system'

  let compare = $state(true)
</script>

<div class="flex items-center gap-2">
  <Switch id="compare" bind:checked={compare} />
  <Label for="compare">Compare to previous shift</Label>
</div>
