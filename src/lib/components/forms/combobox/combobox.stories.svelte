<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Combobox from './combobox.svelte'
  import ComboboxChip from './combobox-chip.svelte'
  import ComboboxChips from './combobox-chips.svelte'
  import ComboboxChipsInput from './combobox-chips-input.svelte'
  import ComboboxContent from './combobox-content.svelte'
  import ComboboxEmpty from './combobox-empty.svelte'
  import ComboboxInput from './combobox-input.svelte'
  import ComboboxItem from './combobox-item.svelte'
  import ComboboxList from './combobox-list.svelte'

  const { Story } = defineMeta({
    title: 'Forms/Combobox',
    component: Combobox,
    tags: ['mise'],
  })

  const CATEGORIES = ['Bread', 'Pastry', 'Cakes', 'Drinks', 'Packaging', 'Dairy', 'Flour & grains']
  const ITEMS = CATEGORIES.map((category) => ({ value: category, label: category }))

  const single = $state({ value: '', search: '' })
  const multiple = $state({
    value: ['Bread', 'Cakes'] as string[],
    search: '',
    anchor: null as HTMLElement | null,
  })

  const matching = (search: string) =>
    CATEGORIES.filter((category) => category.toLowerCase().includes(search.toLowerCase()))
</script>

<!--
  A searchable single select. Reach for it where the list is long enough that
  scanning it is slower than typing (a category picker over hundreds of rows),
  not a five-option status field, which stays a `Select`.

  bits-ui does not filter: keep the typed text from the input's `oninput` and
  render only the items that match. Pass `items` so the field can show the
  chosen label while the list is closed.
-->
<Story name="Playground">
  {#snippet template()}
    <Combobox type="single" bind:value={single.value} items={ITEMS}>
      <ComboboxInput
        class="max-w-xs"
        placeholder="Search category…"
        aria-label="Category"
        showClear
        oninput={(event) => (single.search = event.currentTarget.value)}
      />
      <ComboboxContent>
        {#if matching(single.search).length === 0}
          <ComboboxEmpty>No categories found.</ComboboxEmpty>
        {/if}
        <ComboboxList>
          {#each matching(single.search) as category (category)}
            <ComboboxItem value={category} label={category} />
          {/each}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  {/snippet}
</Story>

<!--
  Several values, each a chip in the field with its own remove button, and the
  text typed after them. Bind the chips' `ref` and pass it to the content's
  `customAnchor`, so the list opens under the whole field rather than under
  the text input.
-->
<Story name="With chips" asChild>
  <Combobox type="multiple" bind:value={multiple.value}>
    <ComboboxChips bind:ref={multiple.anchor} class="max-w-sm">
      {#each multiple.value as category (category)}
        <ComboboxChip
          removeLabel="Remove {category}"
          onRemove={() => (multiple.value = multiple.value.filter((item) => item !== category))}
        >
          {category}
        </ComboboxChip>
      {/each}
      <ComboboxChipsInput
        aria-label="Categories"
        placeholder="Add a category…"
        oninput={(event) => (multiple.search = event.currentTarget.value)}
      />
    </ComboboxChips>
    <ComboboxContent customAnchor={multiple.anchor}>
      <ComboboxList>
        {#each matching(multiple.search) as category (category)}
          <ComboboxItem value={category} label={category} />
        {/each}
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
</Story>
