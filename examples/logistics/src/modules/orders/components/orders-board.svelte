<!-- The orders as a board: a column per open status, each order a card that opens it. -->
<script lang="ts">
  import { Badge, Board, BoardCard, BoardColumn } from '@jovertical/mise-design-system'

  import { clientOf } from '#modules/core/data/lookups.js'
  import { store } from '#modules/core/data/store.svelte.js'
  import { dateTime, money } from '#modules/core/utils/format.js'
  import { OPEN_STATUSES, ordersByStatus } from '#modules/orders/data/index.js'
  import { ORDER_STATUS, SERVICE_LABEL } from '#modules/orders/utils/status.js'
  import { resolve } from '$app/paths'

  const byStatus = $derived(ordersByStatus(store))
</script>

<Board>
  {#each OPEN_STATUSES as status (status)}
    <BoardColumn
      title={ORDER_STATUS[status].label}
      tone={ORDER_STATUS[status].tone}
      count={byStatus[status].length}
      empty="No orders"
    >
      {#if byStatus[status].length}
        {#each byStatus[status].slice(0, 12) as order (order.id)}
          <BoardCard href={resolve('/orders/[id]', { id: order.number })}>
            <div class="flex items-center gap-2">
              <span class="font-medium">{order.number}</span>
              {#if order.service !== 'regular'}
                <Badge tone="primary">{SERVICE_LABEL[order.service]}</Badge>
              {/if}
              <span class="text-muted-foreground ml-auto tabular-nums">{money(order.total)}</span>
            </div>
            <span class="text-muted-foreground truncate">
              {clientOf(store, order.clientId)?.name}
              · {dateTime(order.placedAt)}
            </span>
          </BoardCard>
        {/each}
      {/if}
    </BoardColumn>
  {/each}
</Board>
