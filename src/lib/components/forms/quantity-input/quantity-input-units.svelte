<!--
  Origin: the React package 2.23.0 `quantity-input.tsx` (the unit menu)
  Diverged: the open menu's units, grouped under their headings with a hint
    beside each, and the footer, as their own part so QuantityInput keeps
    under the size the clean-code guide allows. Not exported: both layouts of
    QuantityInput render it inside their SelectContent.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'

  import type { QuantityUnit } from './quantity-input.svelte'

  export type QuantityInputUnitsProps = {
    units: readonly QuantityUnit[]
    groupHints?: Readonly<Record<string, string>>
    menuFooter?: Snippet<[() => void]>
    closeMenu: () => void
  }
</script>

<script lang="ts">
  import SelectGroup from '../select/select-group.svelte'
  import SelectItem from '../select/select-item.svelte'
  import SelectLabel from '../select/select-label.svelte'
  import SelectSeparator from '../select/select-separator.svelte'

  let { units, groupHints, menuFooter, closeMenu }: QuantityInputUnitsProps = $props()

  const isGrouped = $derived(units.some((candidate) => candidate.group !== undefined))

  // Grouped in first-seen order rather than sorted, so the consumer, who knows
  // which kind of measure an item is counted in, puts that one first.
  const groupNames = $derived([...new Set(units.map((candidate) => candidate.group ?? ''))])
</script>

{#snippet option(candidate: QuantityUnit)}
  <SelectItem value={candidate.value} label={candidate.label} />
{/snippet}

{#if isGrouped}
  {#each groupNames as groupName, index (groupName || 'ungrouped')}
    <SelectGroup>
      {#if index > 0}
        <SelectSeparator />
      {/if}
      {#if groupName}
        <SelectLabel
          class="flex items-center justify-between gap-3 font-medium uppercase tracking-wide"
        >
          {groupName}
          {#if groupHints?.[groupName]}
            <span class="font-normal normal-case tracking-normal">{groupHints[groupName]}</span>
          {/if}
        </SelectLabel>
      {/if}
      {#each units.filter(
        (candidate) => (candidate.group ?? '') === groupName,
      ) as candidate (candidate.value)}
        {@render option(candidate)}
      {/each}
    </SelectGroup>
  {/each}
{:else}
  {#each units as candidate (candidate.value)}
    {@render option(candidate)}
  {/each}
{/if}
{#if menuFooter}
  <div
    data-slot="quantity-input-menu-footer"
    class="text-muted-foreground mt-1 flex items-center justify-between gap-3 border-t px-2 pt-2 pb-1 text-xs"
  >
    {@render menuFooter(closeMenu)}
  </div>
{/if}
