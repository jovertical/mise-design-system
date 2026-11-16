<!--
  A switch that stands alone in a form, on its own bordered surface. What it
  turns on goes inside, and is unmounted while off, not hidden.
-->
<script lang="ts">
  import { Input, SwitchField } from '@jovertical/mise-design-system'

  let collectTax = $state(true)
</script>

<div class="w-full max-w-xl">
  <SwitchField
    id="collect-tax"
    label="Collect tax at this location"
    description="Applies the default rate unless overridden below."
    bind:checked={collectTax}
  >
    <Input placeholder="12" aria-label="Rate, in percent" class="max-w-32" />
  </SwitchField>
</div>
