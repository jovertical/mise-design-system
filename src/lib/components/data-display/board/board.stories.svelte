<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import { TONES, type Tone } from '../../../utils/tone.js'
  import Button from '../../actions/button/button.svelte'
  import ToggleGroup from '../../forms/toggle-group/toggle-group.svelte'
  import ToggleGroupItem from '../../forms/toggle-group/toggle-group-item.svelte'
  import PageHeader from '../../layout/page-header/page-header.svelte'
  import PageLayout from '../../layout/page-layout/page-layout.svelte'
  import Badge from '../badge/badge.svelte'
  import Board from './board.svelte'
  import BoardCard from './board-card.svelte'
  import BoardColumn from './board-column.svelte'

  const { Story } = defineMeta({
    title: 'Data display/Board',
    component: Board,
    tags: ['mise'],
    parameters: { layout: 'padded' },
  })

  type Order = { number: string; client: string; total: string; service: string; express?: boolean }

  const COLUMNS: { title: string; tone: Tone; orders: Order[] }[] = [
    {
      title: 'Received',
      tone: 'info',
      orders: [
        { number: 'OR-2059', client: 'Coastal Grocers', total: '$53.00', service: 'Regular' },
        {
          number: 'OR-2058',
          client: 'Little Bay Bakery',
          total: '$81.00',
          service: 'Express',
          express: true,
        },
      ],
    },
    {
      title: 'Ready',
      tone: 'success',
      orders: [
        { number: 'OR-2052', client: 'Bloom & Stem', total: '$44.00', service: 'Regular' },
        {
          number: 'OR-2050',
          client: 'Summit Office Supply',
          total: '$122.00',
          service: 'Same day',
        },
        {
          number: 'OR-2049',
          client: 'Greenline Pharmacy',
          total: '$94.00',
          service: 'Express',
          express: true,
        },
      ],
    },
    {
      title: 'In fulfilment',
      tone: 'warning',
      orders: [
        { number: 'OR-2038', client: 'Northside Hardware', total: '$49.00', service: 'Regular' },
      ],
    },
    {
      title: 'Completed',
      tone: 'neutral',
      orders: [
        { number: 'OR-2019', client: 'Aster Living', total: '$105.00', service: 'Express' },
        { number: 'OR-2018', client: 'Tidewater Seafood', total: '$89.00', service: 'Regular' },
      ],
    },
  ]

  const view = $state({ mode: 'board' })
</script>

{#snippet orderCard(order: Order)}
  <BoardCard href={`#${order.number}`}>
    <div class="flex items-center gap-2">
      <span class="font-medium">{order.number}</span>
      {#if order.express}
        <Badge tone="primary">Express</Badge>
      {/if}
      <span class="text-muted-foreground ml-auto tabular-nums">{order.total}</span>
    </div>
    <span class="text-muted-foreground">{order.client} · {order.service}</span>
  </BoardCard>
{/snippet}

{#snippet board()}
  <Board>
    {#each COLUMNS as column (column.title)}
      <BoardColumn title={column.title} tone={column.tone} count={column.orders.length}>
        {#each column.orders as order (order.number)}
          {@render orderCard(order)}
        {/each}
      </BoardColumn>
    {/each}
  </Board>
{/snippet}

{#snippet showAll()}
  <Button variant="ghost" size="sm">Show all</Button>
{/snippet}

{#snippet boardActions()}
  <ToggleGroup type="single" bind:value={view.mode} variant="outline" size="sm">
    <ToggleGroupItem value="table">Table</ToggleGroupItem>
    <ToggleGroupItem value="board">Board</ToggleGroupItem>
  </ToggleGroup>
{/snippet}

<Story name="Playground">
  {#snippet template()}
    {@render board()}
  {/snippet}
</Story>

<!--
  The dot carries the status's tone and nothing else does: the lane and the
  cards stay neutral, so a board of six colours still reads as one surface.
-->
<Story name="Tones" asChild>
  <StoryAxis values={TONES} orientation="vertical">
    {#snippet item(tone)}
      <BoardColumn title={tone} {tone} count={1}>
        <BoardCard>OR-2041 · Bloom &amp; Stem</BoardCard>
      </BoardColumn>
    {/snippet}
  </StoryAxis>
</Story>

<!--
  An empty column keeps its height with a line saying so, default or custom;
  `actions` sits right of the title.
-->
<Story name="States" asChild>
  <Board>
    <BoardColumn title="Received" tone="info" count={0} />
    <BoardColumn title="Ready" tone="success" count={0} empty="No orders ready to ship" />
    <BoardColumn title="Completed" count={340} actions={showAll}>
      {@render orderCard(COLUMNS[3].orders[0])}
    </BoardColumn>
  </Board>
</Story>

<!--
  A long title truncates in the header; a long client name wraps inside its
  card; a long column grows downwards while the board scrolls only sideways.
-->
<Story name="Long content" asChild>
  <Board>
    <BoardColumn title="Waiting for a collection slot at the depot" tone="warning" count={12}>
      {#each Array.from({ length: 12 }, (_, index) => index) as index (index)}
        {@render orderCard({
          number: `OR-${2100 + index}`,
          client:
            index === 0
              ? 'Harbourside Outfitters and Marine Supply Cooperative'
              : 'Fieldstone Farms',
          total: '$64.00',
          service: 'Regular',
        })}
      {/each}
    </BoardColumn>
    <BoardColumn title="Ready" tone="success" count={1}>
      {@render orderCard(COLUMNS[1].orders[0])}
    </BoardColumn>
  </Board>
</Story>

<!-- Where the logistics example puts it: a Table / Board toggle in the page header. -->
<Story name="In a page" asChild>
  <PageLayout>
    <PageHeader
      title="Orders"
      description="Review requests and turn ready orders into shipments."
      actions={boardActions}
    />
    {@render board()}
  </PageLayout>
</Story>
