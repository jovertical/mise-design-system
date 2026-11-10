<!--
  The orders as a board: a column per status, every order a card that opens
  it. A card can be dragged one step on (Received to Ready, Ready to In
  fulfilment) or to Cancelled; the page decides what a drop does.
-->
<script lang="ts">
  import {
    Badge,
    Board,
    BoardCard,
    type BoardCardRef,
    BoardColumn,
    type BoardMove,
  } from '@jovertical/mise-design-system'

  import { clientOf } from '#modules/core/data/lookups.js'
  import { store } from '#modules/core/data/store.svelte.js'
  import { dateTime, money } from '#modules/core/utils/format.js'
  import { BOARD_STATUSES, ordersByStatus } from '#modules/orders/data/index.js'
  import type { OrderStatus } from '#modules/orders/data/types.js'
  import { ORDER_STATUS, SERVICE_LABEL } from '#modules/orders/utils/status.js'
  import { resolve } from '$app/paths'

  let { onmove }: { onmove: (move: BoardMove) => void } = $props()

  const byStatus = $derived(ordersByStatus(store))

  /** Forward one step, or to Cancelled from any open status. */
  const ACCEPTS: Record<OrderStatus, (card: BoardCardRef) => boolean> = {
    received: () => false,
    ready: (card) => card.from === 'received',
    'in-fulfilment': (card) => card.from === 'ready',
    completed: () => false,
    cancelled: (card) => card.from !== 'completed',
  }
</script>

<Board onMove={onmove} class="h-[calc(100svh-24rem)] min-h-96">
  {#each BOARD_STATUSES as status (status)}
    <BoardColumn
      id={status}
      title={ORDER_STATUS[status].label}
      tone={ORDER_STATUS[status].tone}
      count={byStatus[status].length}
      accepts={ACCEPTS[status]}
      empty="No orders"
    >
      {#if byStatus[status].length}
        {#each byStatus[status] as order (order.id)}
          <BoardCard
            id={order.id}
            label={order.number}
            href={resolve('/orders/[id]', { id: order.number })}
          >
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
