<!--
  Origin: the React package 2.23.0 `data-table-faceted-filter.tsx`
  Diverged: the trigger and the counts drop `font-mono`, which the package does
    not use; counts are `tabular-nums`. Lucide's chevron-down and check for
    Tabler's. The column is TanStack Table 9's (R4b-1). The selection is read
    off the column's filter value, which Svelte tracks; React needed it passed
    as a prop to re-render, and `selected` stays for a caller who holds it.
-->
<script lang="ts" module>
  import type { Column, RowData } from '@tanstack/svelte-table'
  import type { Component } from 'svelte'

  import type { DataTableFeatures } from './features.js'

  export type DataTableFacetedFilterOption = {
    label: string
    value: string
    icon?: Component<{ class?: string }>
  }

  /**
   * A multi-select facet, drawn as a select: a filled pill summarising the
   * choice rather than a dashed "add filter" chip, since a row of five dashed
   * outlines is noisier than the values it filters. One choice shows its name;
   * more show a count.
   */
  export type DataTableFacetedFilterProps<TData extends RowData, TValue> = {
    column?: Column<DataTableFeatures, TData, TValue>
    /** Singular noun for the facet: "Status". */
    title?: string
    /** Shown when nothing is chosen. Falls back to "All {title}"; pass it where the plural is irregular. */
    allLabel?: string
    /** The chosen values, for a caller that holds them. Read off the column otherwise. */
    selected?: string[]
    options: DataTableFacetedFilterOption[]
  }
</script>

<script lang="ts" generics="TData extends RowData, TValue">
  import CheckIcon from '@lucide/svelte/icons/check'
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down'

  import { cn } from '../../../utils/cn.js'
  import Button from '../../actions/button/button.svelte'
  import Command from '../../actions/command/command.svelte'
  import CommandEmpty from '../../actions/command/command-empty.svelte'
  import CommandGroup from '../../actions/command/command-group.svelte'
  import CommandInput from '../../actions/command/command-input.svelte'
  import CommandItem from '../../actions/command/command-item.svelte'
  import CommandList from '../../actions/command/command-list.svelte'
  import Popover from '../../overlays/popover/popover.svelte'
  import PopoverContent from '../../overlays/popover/popover-content.svelte'
  import PopoverTrigger from '../../overlays/popover/popover-trigger.svelte'

  let { column, title, allLabel, selected, options }: DataTableFacetedFilterProps<TData, TValue> =
    $props()

  /**
   * Counts only from a column with an accessor: TanStack throws computing
   * faceted values for a display column, and a display column bound to a
   * server-side filter should cost the counts, nothing more.
   */
  const facets = $derived(column?.accessorFn ? column.getFacetedUniqueValues() : undefined)
  const chosen = $derived(
    new Set(selected ?? (column?.getFilterValue() as string[] | undefined) ?? []),
  )
  const emptyLabel = $derived(allLabel ?? `All ${title?.toLowerCase() ?? 'items'}`)
  const chosenOptions = $derived(options.filter((option) => chosen.has(option.value)))
  const triggerLabel = $derived(
    chosenOptions.length === 0
      ? emptyLabel
      : chosenOptions.length === 1
        ? chosenOptions[0].label
        : `${chosenOptions.length} selected`,
  )

  function toggle(value: string) {
    const next = new Set(chosen)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    column?.setFilterValue(next.size ? [...next] : undefined)
  }
</script>

<Popover>
  <PopoverTrigger>
    {#snippet child({ props })}
      <Button
        variant="ghost"
        class={cn(
          'bg-input/50 hover:bg-input h-8 justify-between gap-1.5 rounded-2xl border border-transparent px-3 text-sm font-normal whitespace-nowrap',
          chosen.size === 0 && 'text-muted-foreground',
        )}
        {...props}
      >
        <span class="truncate">{triggerLabel}</span>
        <ChevronDownIcon class="size-4 shrink-0 opacity-60" />
      </Button>
    {/snippet}
  </PopoverTrigger>
  <PopoverContent class="w-56 p-0" align="start">
    <Command>
      <CommandInput placeholder={title} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          <CommandItem value={emptyLabel} onSelect={() => column?.setFilterValue(undefined)}>
            <span class="flex-1">{emptyLabel}</span>
            {#if chosen.size === 0}
              <CheckIcon class="size-4 shrink-0" />
            {/if}
          </CommandItem>
          {#each options as option (option.value)}
            <CommandItem value={option.label} onSelect={() => toggle(option.value)}>
              {#if option.icon}
                <option.icon class="text-muted-foreground mr-2 size-4" />
              {/if}
              <span class="flex-1 truncate">{option.label}</span>
              {#if facets?.get(option.value)}
                <span class="text-muted-foreground text-xs tabular-nums"
                  >{facets.get(option.value)}</span
                >
              {/if}
              {#if chosen.has(option.value)}
                <CheckIcon class="size-4 shrink-0" />
              {/if}
            </CommandItem>
          {/each}
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>
