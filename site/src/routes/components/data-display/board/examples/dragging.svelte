<!--
  With `onMove`, a card with an `id` can be dragged to a column with an `id`:
  by pointer, by a long press on touch, or from the keyboard. mise only reports
  the drop; the card moves when the data does, here in `move`. Shipped takes
  only packed orders, through `accepts`.
-->
<script lang="ts">
  import {
    Board,
    BoardCard,
    type BoardCardRef,
    BoardColumn,
    type BoardMove,
    type Tone,
  } from '@jovertical/mise-design-system'

  type Lane = 'received' | 'packed' | 'shipped'
  type Order = { number: string; client: string }

  const LANES: { id: Lane; title: string; tone: Tone }[] = [
    { id: 'received', title: 'Received', tone: 'info' },
    { id: 'packed', title: 'Packed', tone: 'success' },
    { id: 'shipped', title: 'Shipped', tone: 'neutral' },
  ]

  const ACCEPTS: Partial<Record<Lane, (card: BoardCardRef) => boolean>> = {
    shipped: (card) => card.from === 'packed',
  }

  const lanes = $state<Record<Lane, Order[]>>({
    received: [
      { number: 'OR-2120', client: 'Coastal Grocers' },
      { number: 'OR-2121', client: 'Fieldstone Farms' },
      { number: 'OR-2122', client: 'Aster Living' },
    ],
    packed: [{ number: 'OR-2110', client: 'Bloom & Stem' }],
    shipped: [],
  })

  function move({ id, from, to }: BoardMove) {
    const order = lanes[from as Lane].find((candidate) => candidate.number === id)

    if (!order) return

    lanes[from as Lane] = lanes[from as Lane].filter((candidate) => candidate !== order)

    lanes[to as Lane] = [order, ...lanes[to as Lane]]
  }
</script>

<Board class="w-full" onMove={move}>
  {#each LANES as lane (lane.id)}
    <BoardColumn
      id={lane.id}
      title={lane.title}
      tone={lane.tone}
      count={lanes[lane.id].length}
      accepts={ACCEPTS[lane.id]}
      empty="Drop an order here"
    >
      {#if lanes[lane.id].length}
        {#each lanes[lane.id] as order (order.number)}
          <BoardCard id={order.number} label={order.number}>
            <span class="font-medium">{order.number}</span>
            <span class="text-muted-foreground">{order.client}</span>
          </BoardCard>
        {/each}
      {/if}
    </BoardColumn>
  {/each}
</Board>
