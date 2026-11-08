<script lang="ts">
  import { Checkbox, Label } from '../../src/lib/index.js'

  let {
    checked = $bindable(false),
    indeterminate = $bindable(false),
    disabled = false,
  }: { checked?: boolean; indeterminate?: boolean; disabled?: boolean } = $props()
</script>

<Checkbox id="count-done" bind:checked bind:indeterminate {disabled} />
<Label for="count-done">Stock count done</Label>
<output data-testid="state">{checked ? 'checked' : 'unchecked'}</output>
