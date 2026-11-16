<!--
  Indeterminate is the "some of these" mark on a parent row, such as a
  location whose shifts are partly closed: a minus on the checked fill.
-->
<script lang="ts">
  import { Checkbox, Label } from '@jovertical/mise-design-system'

  const STATES = [
    { id: 'unchecked', label: 'Unchecked', checked: false, indeterminate: false, disabled: false },
    { id: 'checked', label: 'Checked', checked: true, indeterminate: false, disabled: false },
    { id: 'some', label: 'Indeterminate', checked: false, indeterminate: true, disabled: false },
    { id: 'off', label: 'Disabled', checked: false, indeterminate: false, disabled: true },
  ]
</script>

<div class="flex flex-col gap-3">
  {#each STATES as state (state.id)}
    <div class="flex items-center gap-2">
      <Checkbox
        id={state.id}
        checked={state.checked}
        indeterminate={state.indeterminate}
        disabled={state.disabled}
      />
      <Label for={state.id}>{state.label}</Label>
    </div>
  {/each}
</div>
