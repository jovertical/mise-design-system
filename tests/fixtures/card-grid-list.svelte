<script lang="ts">
  import { CardGrid, CardGridCell, CardList } from '../../src/lib/index.js'

  let {
    kind,
    columns,
    compact,
  }: { kind: 'grid' | 'list'; columns?: 2 | 3 | 4; compact?: boolean } = $props()
</script>

{#if kind === 'grid'}
  <CardGrid {columns}>
    <CardGridCell>Ambient</CardGridCell>
    <CardGridCell>Chilled</CardGridCell>
  </CardGrid>
{:else}
  <CardList {compact}>
    <div data-slot="row">Open</div>
    <div data-slot="row">Closed</div>
  </CardList>
{/if}
