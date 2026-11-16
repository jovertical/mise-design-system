<!--
  Several values, each a chip with its own remove button, and the text typed
  after them. Bind the chips' `ref` and pass it to the content's
  `customAnchor`, so the list opens under the whole field.
-->
<script lang="ts">
  import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxItem,
    ComboboxList,
  } from '@jovertical/mise-design-system'

  const CATEGORIES = ['Bread', 'Pastry', 'Cakes', 'Drinks', 'Packaging', 'Dairy']

  let value: string[] = $state(['Bread', 'Cakes'])
  let search = $state('')
  let anchor: HTMLElement | null = $state(null)

  const matching = $derived(
    CATEGORIES.filter((category) => category.toLowerCase().includes(search.toLowerCase())),
  )
</script>

<Combobox type="multiple" bind:value>
  <ComboboxChips bind:ref={anchor} class="max-w-sm">
    {#each value as category (category)}
      <ComboboxChip
        removeLabel="Remove {category}"
        onRemove={() => (value = value.filter((item) => item !== category))}
      >
        {category}
      </ComboboxChip>
    {/each}
    <ComboboxChipsInput
      aria-label="Categories"
      placeholder="Add a category…"
      oninput={(event) => (search = event.currentTarget.value)}
    />
  </ComboboxChips>
  <ComboboxContent customAnchor={anchor}>
    <ComboboxList>
      {#each matching as category (category)}
        <ComboboxItem value={category} label={category} />
      {/each}
    </ComboboxList>
  </ComboboxContent>
</Combobox>
