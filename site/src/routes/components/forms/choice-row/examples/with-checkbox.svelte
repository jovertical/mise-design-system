<!-- Several at once: a checkbox per row. A click on the row, the box or the label is one toggle. -->
<script lang="ts">
  import { Checkbox, ChoiceRow } from '@jovertical/mise-design-system'

  const KINDS = [
    { id: 'bakery', label: 'Bakery', description: 'Bread, pastry, counter service.' },
    { id: 'cafe', label: 'Café', description: 'Drinks and a seated area.' },
    { id: 'grocery', label: 'Grocery', description: 'Packaged goods, weighed items.' },
    { id: 'pharmacy', label: 'Pharmacy', description: 'Regulated stock and dispensing.' },
  ]

  let chosen: Record<string, boolean> = $state({
    bakery: true,
    cafe: false,
    grocery: false,
    pharmacy: false,
  })
</script>

<div class="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
  {#each KINDS as kind (kind.id)}
    {#snippet box()}
      <Checkbox id="kind-{kind.id}" bind:checked={chosen[kind.id]} />
    {/snippet}
    <ChoiceRow
      for="kind-{kind.id}"
      control={box}
      label={kind.label}
      description={kind.description}
    />
  {/each}
</div>
