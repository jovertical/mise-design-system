<script lang="ts">
  import { Checkbox, ChoiceRow } from '@jovertical/mise-design-system'
</script>

{#snippet box()}
  <Checkbox id="anatomy-online" disabled />
{/snippet}

<div class="w-96">
  <ChoiceRow
    for="anatomy-online"
    control={box}
    label="Online store"
    description="A storefront customers browse."
    badge="Coming soon"
    disabled
  />
</div>
