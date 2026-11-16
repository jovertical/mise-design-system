<!--
  A searchable single select, for a list long enough that typing beats
  scanning. bits-ui does not filter: keep the typed text from the input's
  `oninput` and render only the items that match. `items` lets the field show
  the chosen label while the list is closed.
-->
<script lang="ts">
  import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
  } from '@jovertical/mise-design-system'

  const CATEGORIES = ['Bread', 'Pastry', 'Cakes', 'Drinks', 'Packaging', 'Dairy', 'Flour & grains']
  const ITEMS = CATEGORIES.map((category) => ({ value: category, label: category }))

  let value = $state('')
  let search = $state('')

  const matching = $derived(
    CATEGORIES.filter((category) => category.toLowerCase().includes(search.toLowerCase())),
  )
</script>

<Combobox type="single" bind:value items={ITEMS}>
  <ComboboxInput
    class="max-w-xs"
    placeholder="Search category…"
    aria-label="Category"
    showClear
    oninput={(event) => (search = event.currentTarget.value)}
  />
  <ComboboxContent>
    {#if matching.length === 0}
      <ComboboxEmpty>No categories found.</ComboboxEmpty>
    {/if}
    <ComboboxList>
      {#each matching as category (category)}
        <ComboboxItem value={category} label={category} />
      {/each}
    </ComboboxList>
  </ComboboxContent>
</Combobox>
