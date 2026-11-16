<!--
  The items as suggestions: `allowCustomValue` makes the typed text the value,
  kept when the field loses focus, so a description that matches nothing is
  still saved as written. Each suggestion shows its category beside it.
-->
<script lang="ts">
  import {
    Combobox,
    ComboboxContent,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
  } from '@jovertical/mise-design-system'

  const EXPENSES = [
    { label: 'Fuel', category: 'Vehicles' },
    { label: 'Freight', category: 'Shipping' },
    { label: 'Pallets', category: 'Packaging' },
    { label: 'Shrink wrap', category: 'Packaging' },
  ]

  const ITEMS = EXPENSES.map((expense) => ({ value: expense.label, label: expense.label }))

  let value = $state('Toll fee')
  let search = $state('')
</script>

<div class="w-80">
  <Combobox type="single" allowCustomValue bind:value items={ITEMS}>
    <ComboboxInput
      aria-label="Expense"
      placeholder="What was it for?"
      showClear
      oninput={(event) => (search = event.currentTarget.value)}
    />
    <ComboboxContent>
      <ComboboxList>
        {#each EXPENSES.filter((expense) =>
          expense.label.toLowerCase().includes(search.toLowerCase()),
        ) as expense (expense.label)}
          <ComboboxItem value={expense.label} label={expense.label}>
            {expense.label}
            <span class="text-muted-foreground ml-auto text-xs">{expense.category}</span>
          </ComboboxItem>
        {/each}
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
</div>
