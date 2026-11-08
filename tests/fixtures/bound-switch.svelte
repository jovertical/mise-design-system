<script lang="ts">
  import { Label, Switch } from '../../src/lib/index.js'

  let { checked = $bindable(false), disabled = false }: { checked?: boolean; disabled?: boolean } =
    $props()
</script>

<Switch id="compare" bind:checked {disabled} />
<Label for="compare">Compare to previous shift</Label>
<output data-testid="state">{checked ? 'on' : 'off'}</output>
