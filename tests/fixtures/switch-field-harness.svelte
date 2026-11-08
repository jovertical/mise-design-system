<script lang="ts">
  import { SwitchField, type SwitchFieldVariant } from '../../src/lib/index.js'

  let {
    checked = $bindable(false),
    variant,
    disabled,
    reveal = true,
  }: {
    checked?: boolean
    variant?: SwitchFieldVariant
    disabled?: boolean
    reveal?: boolean
  } = $props()
</script>

{#snippet revealed()}
  <p>Override fields</p>
{/snippet}

<SwitchField
  id="collect-tax"
  label="Collect tax at this location"
  description="Applies the default rate unless overridden."
  bind:checked
  {variant}
  {disabled}
  children={reveal ? revealed : undefined}
/>
<output data-testid="checked">{checked ? 'on' : 'off'}</output>
