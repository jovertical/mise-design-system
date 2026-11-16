<!-- Content under the chosen row, inside its border: the fields that choice needs. -->
<script lang="ts">
  import { ChoiceRow, Input, RadioGroup, RadioGroupItem } from '@jovertical/mise-design-system'

  let publish = $state('later')
</script>

{#snippet nowRadio()}
  <RadioGroupItem id="reveal-now" value="now" />
{/snippet}

{#snippet laterRadio()}
  <RadioGroupItem id="reveal-later" value="later" />
{/snippet}

<RadioGroup bind:value={publish} class="w-full max-w-md gap-3">
  <ChoiceRow for="reveal-now" control={nowRadio} label="Publish now" />
  <ChoiceRow for="reveal-later" control={laterRadio} label="Schedule for later">
    {#if publish === 'later'}
      <Input type="date" aria-label="Publish on" />
    {/if}
  </ChoiceRow>
</RadioGroup>
