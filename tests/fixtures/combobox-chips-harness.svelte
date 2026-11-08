<script lang="ts">
  import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxItem,
    ComboboxList,
  } from '../../src/lib/index.js'

  const CATEGORIES = ['Bread', 'Pastry', 'Cakes']

  let { value = $bindable(['Bread', 'Cakes']) }: { value?: string[] } = $props()
  let anchor = $state<HTMLElement | null>(null)
</script>

<Combobox type="multiple" bind:value>
  <ComboboxChips bind:ref={anchor}>
    {#each value as category (category)}
      <ComboboxChip
        removeLabel="Remove {category}"
        onRemove={() => (value = value.filter((item) => item !== category))}
      >
        {category}
      </ComboboxChip>
    {/each}
    <ComboboxChipsInput aria-label="Categories" />
  </ComboboxChips>
  <ComboboxContent customAnchor={anchor}>
    <ComboboxList>
      {#each CATEGORIES as category (category)}
        <ComboboxItem value={category} label={category} />
      {/each}
    </ComboboxList>
  </ComboboxContent>
</Combobox>
<output data-testid="value">{value.join(',')}</output>
