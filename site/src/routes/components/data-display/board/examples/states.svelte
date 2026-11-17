<!--
  An empty column keeps its height with a line saying so, the default or your
  own. `count` is how many the column holds, which may be more than it shows;
  `actions` sits right of the title.
-->
<script lang="ts">
  import { Board, BoardCard, BoardColumn, Button } from '@jovertical/mise-design-system'
</script>

{#snippet showAll()}
  <Button variant="ghost" size="sm" href="#/orders">Show all</Button>
{/snippet}

<Board class="w-full">
  <BoardColumn title="Received" tone="info" count={0} />
  <BoardColumn title="Ready" tone="success" count={0} empty="No orders ready to ship" />
  <BoardColumn title="Completed" count={340} actions={showAll}>
    <BoardCard href="#/orders/OR-2019">
      <span class="font-medium">OR-2019</span>
      <span class="text-muted-foreground">Aster Living</span>
    </BoardCard>
  </BoardColumn>
</Board>
