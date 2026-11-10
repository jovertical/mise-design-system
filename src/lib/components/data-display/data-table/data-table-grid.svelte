<!--
  Origin: the React package 2.23.0 `data-table.tsx` (the grid view)
  Diverged: `grid` view, the cards with their placeholders and load-more, as
    its own part so DataTable keeps under the size the clean-code guide
    allows. Not exported.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'

  export type DataTableGridProps<TData> = {
    data: TData[]
    card?: Snippet<[TData]>
    cardSkeleton?: Snippet
    gridClass?: string
    getItemKey?: (item: TData) => string | number
    emptyState?: Snippet
    isLoading: boolean
    hasNextPage: boolean
    isFetchingNextPage: boolean
    fetchNextPage?: () => void
  }
</script>

<script lang="ts" generics="TData">
  import { cn } from '../../../utils/cn.js'
  import Spinner from '../../feedback/spinner/spinner.svelte'

  let {
    data,
    card,
    cardSkeleton,
    gridClass,
    getItemKey,
    emptyState,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  }: DataTableGridProps<TData> = $props()

  const gridClasses = $derived(
    cn('grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3', gridClass),
  )
</script>

{#if card}
  {#if isLoading}
    {#if cardSkeleton}
      <div class={gridClasses}>
        {#each Array.from({ length: 8 }, (_, index) => index) as index (index)}
          {@render cardSkeleton()}
        {/each}
      </div>
    {:else}
      <div class="flex h-24 items-center justify-center"><Spinner class="size-6" /></div>
    {/if}
  {:else if data.length === 0}
    {@render emptyState?.()}
  {:else}
    <div class={gridClasses}>
      {#each data as item, index (getItemKey?.(item) ?? index)}
        {@render card(item)}
      {/each}
    </div>
  {/if}
{/if}
{#if hasNextPage}
  <div class="mt-4 flex justify-center">
    <button
      type="button"
      class="text-muted-foreground cursor-pointer hover:underline"
      onclick={fetchNextPage}
      disabled={isFetchingNextPage}
    >
      {#if isFetchingNextPage}
        <Spinner />
      {:else}
        Load more
      {/if}
    </button>
  </div>
{/if}
