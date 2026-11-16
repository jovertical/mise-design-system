<!--
  One of several, each with room for a description. `for` matches the
  control's id, so a click anywhere on the row reaches the control.
-->
<script lang="ts">
  import { ChoiceRow, RadioGroup, RadioGroupItem } from '@jovertical/mise-design-system'

  let publish = $state('now')
</script>

{#snippet nowRadio()}
  <RadioGroupItem id="publish-now" value="now" />
{/snippet}

{#snippet laterRadio()}
  <RadioGroupItem id="publish-later" value="later" />
{/snippet}

<RadioGroup bind:value={publish} class="w-full max-w-md gap-3">
  <ChoiceRow
    for="publish-now"
    control={nowRadio}
    label="Publish now"
    description="The menu goes live on every register."
  />
  <ChoiceRow
    for="publish-later"
    control={laterRadio}
    label="Schedule for later"
    description="Pick a date and let it publish itself."
  />
</RadioGroup>
