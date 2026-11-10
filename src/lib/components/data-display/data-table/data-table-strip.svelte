<!--
  Origin: the React package 2.23.0 `data-table.tsx` (the closing strip)
  Diverged: the strip under the table, the row count and load-more or the
    caller's footer, as its own part so DataTable keeps under the size the
    clean-code guide allows. Not exported.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'

  export type DataTableStripProps = {
    footer?: Snippet
    rowCount: number
    selectedCount: number
    enableRowSelection: boolean
    isLoading: boolean
    hasNextPage: boolean
    isFetchingNextPage: boolean
    fetchNextPage?: () => void
  }
</script>

<script lang="ts">
  import Spinner from '../../feedback/spinner/spinner.svelte'

  let {
    footer,
    rowCount,
    selectedCount,
    enableRowSelection,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  }: DataTableStripProps = $props()
</script>

{#if !isLoading && rowCount > 0}
  {#if footer}
    <div class="text-muted-foreground flex items-center justify-center border-t px-4 py-3 text-sm">
      {@render footer()}
    </div>
  {:else}
    <div
      data-slot="data-table-strip"
      class="text-muted-foreground grid grid-cols-3 items-center gap-4 border-t px-4 py-3 text-sm"
    >
      <span class="tabular-nums">
        {enableRowSelection
          ? `${selectedCount} of ${rowCount} row(s) selected`
          : `Showing ${rowCount} ${rowCount === 1 ? 'row' : 'rows'}`}
      </span>
      <div class="flex justify-center">
        {#if hasNextPage}
          <button
            type="button"
            class="text-foreground cursor-pointer font-medium hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            onclick={fetchNextPage}
            disabled={isFetchingNextPage}
          >
            {#if isFetchingNextPage}
              <Spinner />
            {:else}
              Load more
            {/if}
          </button>
        {/if}
      </div>
      <!-- Balances the count so the button sits centred. -->
      <span aria-hidden="true"></span>
    </div>
  {/if}
{/if}
