<script lang="ts">
  import { Board, BoardCard, BoardColumn } from '@jovertical/mise-design-system'
</script>

<Board>
  <BoardColumn title="Received" tone="info" count={2}>
    <BoardCard>
      <span class="font-medium">OR-2059</span>
      <span class="text-muted-foreground">Coastal Grocers</span>
    </BoardCard>
    <BoardCard>
      <span class="font-medium">OR-2058</span>
      <span class="text-muted-foreground">Little Bay Bakery</span>
    </BoardCard>
  </BoardColumn>
  <BoardColumn title="Ready" tone="success" count={0} empty="No orders ready" />
</Board>
