<script lang="ts">
  import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
  } from '../../src/lib/index.js'

  const CATEGORIES = ['Bread', 'Pastry', 'Cakes', 'Drinks', 'Packaging']
  const items = CATEGORIES.map((category) => ({ value: category, label: category }))

  let { value = $bindable('') }: { value?: string } = $props()

  let search = $state('')

  const matches = $derived(
    CATEGORIES.filter((category) => category.toLowerCase().includes(search.toLowerCase())),
  )
</script>

<Combobox type="single" bind:value {items}>
  <ComboboxInput
    aria-label="Category"
    placeholder="Search category…"
    showClear
    oninput={(event) => (search = event.currentTarget.value)}
  />
  <ComboboxContent>
    {#if matches.length === 0}
      <ComboboxEmpty>No categories found.</ComboboxEmpty>
    {/if}
    <ComboboxList>
      {#each matches as category (category)}
        <ComboboxItem value={category} label={category} />
      {/each}
    </ComboboxList>
  </ComboboxContent>
</Combobox>
<output data-testid="value">{value}</output>
