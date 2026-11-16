<!--
  Open on the page, for the anatomy: no portal, so the list renders in the
  stage under its field, and none of the hold an open list takes on the page.
-->
<script lang="ts">
  import {
    Combobox,
    ComboboxContent,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
  } from '@jovertical/mise-design-system'

  const ITEMS = ['Bread', 'Pastry', 'Cakes'].map((category) => ({
    value: category,
    label: category,
  }))
</script>

<div class="h-64 w-72">
  <Combobox type="single" open value="Pastry" items={ITEMS}>
    <ComboboxInput placeholder="Search category…" aria-label="Category" showClear />
    <ComboboxContent
      portalProps={{ disabled: true }}
      preventScroll={false}
      interactOutsideBehavior="ignore"
      escapeKeydownBehavior="ignore"
    >
      <ComboboxList>
        {#each ITEMS as item (item.value)}
          <ComboboxItem value={item.value} label={item.label} />
        {/each}
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
</div>
