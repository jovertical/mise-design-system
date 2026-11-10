<script lang="ts">
  import {
    Combobox,
    ComboboxContent,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
  } from '../../src/lib/index.js'

  const SUGGESTIONS = ['Fuel', 'Freight', 'Packaging']
  const items = SUGGESTIONS.map((label) => ({ value: label, label }))

  let { value = $bindable('') }: { value?: string } = $props()

  let search = $state('')

  const matches = $derived(
    SUGGESTIONS.filter((label) => label.toLowerCase().includes(search.toLowerCase())),
  )
</script>

<Combobox type="single" allowCustomValue bind:value {items}>
  <ComboboxInput
    aria-label="Description"
    showClear
    oninput={(event) => (search = event.currentTarget.value)}
  />
  <ComboboxContent>
    <ComboboxList>
      {#each matches as label (label)}
        <ComboboxItem value={label} {label} />
      {/each}
    </ComboboxList>
  </ComboboxContent>
</Combobox>
<button type="button">Elsewhere</button>
<output data-testid="value">{value}</output>
