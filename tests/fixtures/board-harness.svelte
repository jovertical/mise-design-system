<script lang="ts">
  import { Board, BoardCard, BoardColumn } from '../../src/lib/index.js'
</script>

{#snippet completedTitle()}
  <em>Completed</em>
{/snippet}
{#snippet showAll()}
  <button type="button">Show all</button>
{/snippet}

<Board>
  <BoardColumn title="Received" tone="info" count={2}>
    <BoardCard href="/orders/OR-2054">OR-2054 · Coastal Grocers</BoardCard>
    <BoardCard>OR-2055 · Bloom &amp; Stem</BoardCard>
  </BoardColumn>
  <BoardColumn title="Ready" tone="success" count={0} empty="No orders ready" />
  <BoardColumn title={completedTitle} actions={showAll}>
    <BoardCard>OR-2033 · Aster Living</BoardCard>
  </BoardColumn>
</Board>
