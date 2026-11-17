<!--
  Columns of orders grouped by status, a pipeline read across. The dot carries
  the status's tone and nothing else does. With `href` a card is a link to its
  order. The row scrolls sideways rather than squeezing its columns.
-->
<script lang="ts">
  import { Badge, Board, BoardCard, BoardColumn, type Tone } from '@jovertical/mise-design-system'

  type Order = { number: string; client: string; total: string; express?: boolean }

  const columns: { title: string; tone: Tone; orders: Order[] }[] = [
    {
      title: 'Received',
      tone: 'info',
      orders: [
        { number: 'OR-2059', client: 'Coastal Grocers', total: '$53.00' },
        { number: 'OR-2058', client: 'Little Bay Bakery', total: '$81.00', express: true },
      ],
    },
    {
      title: 'Ready',
      tone: 'success',
      orders: [
        { number: 'OR-2052', client: 'Bloom & Stem', total: '$44.00' },
        { number: 'OR-2049', client: 'Greenline Pharmacy', total: '$94.00', express: true },
      ],
    },
    {
      title: 'In fulfilment',
      tone: 'warning',
      orders: [{ number: 'OR-2038', client: 'Northside Hardware', total: '$49.00' }],
    },
    {
      title: 'Completed',
      tone: 'neutral',
      orders: [{ number: 'OR-2019', client: 'Aster Living', total: '$105.00' }],
    },
  ]
</script>

<Board class="w-full">
  {#each columns as column (column.title)}
    <BoardColumn title={column.title} tone={column.tone} count={column.orders.length}>
      {#each column.orders as order (order.number)}
        <BoardCard href="#/orders/{order.number}">
          <div class="flex items-center gap-2">
            <span class="font-medium">{order.number}</span>
            {#if order.express}
              <Badge tone="primary">Express</Badge>
            {/if}
            <span class="text-muted-foreground ml-auto tabular-nums">{order.total}</span>
          </div>
          <span class="text-muted-foreground">{order.client}</span>
        </BoardCard>
      {/each}
    </BoardColumn>
  {/each}
</Board>
