<!--
  Origin: the React package 2.23.0 `data-table-column-header.tsx`
  Diverged: the column is TanStack Table 9's (R4b-1). Takes `class`, as every
    component does.
-->
<script lang="ts" module>
  import type { Column, RowData } from '@tanstack/svelte-table'
  import type { Snippet } from 'svelte'

  import type { DataTableFeatures } from './features.js'

  /**
   * A column's heading, with a sort menu when the column sorts. A sortable
   * header is a button and an unsortable one bare text, so the button is pinned
   * to the type `TableHead` already sets (12px, medium, muted) and the two read
   * as one kind of heading.
   */
  export type DataTableColumnHeaderProps<TData extends RowData, TValue> = {
    column: Column<DataTableFeatures, TData, TValue>
    title: string | Snippet
    class?: string
  }
</script>

<script lang="ts" generics="TData extends RowData, TValue">
  import IconArrowDown from '@tabler/icons-svelte-runes/icons/arrow-down'
  import IconArrowUp from '@tabler/icons-svelte-runes/icons/arrow-up'
  import IconArrowsSort from '@tabler/icons-svelte-runes/icons/arrows-sort'
  import IconEyeOff from '@tabler/icons-svelte-runes/icons/eye-off'

  import { cn } from '../../../utils/cn.js'
  import Button from '../../actions/button/button.svelte'
  import DropdownMenu from '../../actions/dropdown-menu/dropdown-menu.svelte'
  import DropdownMenuContent from '../../actions/dropdown-menu/dropdown-menu-content.svelte'
  import DropdownMenuItem from '../../actions/dropdown-menu/dropdown-menu-item.svelte'
  import DropdownMenuSeparator from '../../actions/dropdown-menu/dropdown-menu-separator.svelte'
  import DropdownMenuTrigger from '../../actions/dropdown-menu/dropdown-menu-trigger.svelte'

  let { column, title, class: className }: DataTableColumnHeaderProps<TData, TValue> = $props()

  /** Read off the column: the table is the source of truth. */
  const direction = $derived(column.getIsSorted())
</script>

{#snippet text()}
  {#if typeof title === 'function'}
    {@render title()}
  {:else}
    {title}
  {/if}
{/snippet}

{#if !column.getCanSort()}
  <div class={cn(className)}>{@render text()}</div>
{:else}
  <div class={cn('flex items-center space-x-2', className)}>
    <DropdownMenu>
      <DropdownMenuTrigger>
        {#snippet child({ props })}
          <Button
            variant="ghost"
            tone="neutral"
            size="sm"
            class="text-muted-foreground hover:text-foreground -ml-2 h-7 gap-1.5 px-2 text-xs font-medium"
            {...props}
          >
            <span>{@render text()}</span>
            {#if direction === 'desc'}
              <IconArrowDown class="size-3.5" />
            {:else if direction === 'asc'}
              <IconArrowUp class="size-3.5" />
            {:else}
              <IconArrowsSort class="size-3.5" />
            {/if}
          </Button>
        {/snippet}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onSelect={() => column.toggleSorting(false)}>
          <IconArrowUp class="text-muted-foreground/70 mr-1.5 size-3.5" />
          Asc
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => column.toggleSorting(true)}>
          <IconArrowDown class="text-muted-foreground/70 mr-1.5 size-3.5" />
          Desc
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={!column.getCanHide()}
          onSelect={() => column.toggleVisibility(false)}
        >
          <IconEyeOff class="text-muted-foreground/70 mr-1.5 size-3.5" />
          Hide
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
{/if}
