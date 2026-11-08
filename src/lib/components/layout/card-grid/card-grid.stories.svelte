<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Badge from '../../data-display/badge/badge.svelte'
  import Card from '../card/card.svelte'
  import CardContent from '../card/card-content.svelte'
  import CardHeader from '../card/card-header.svelte'
  import CardTitle from '../card/card-title.svelte'
  import CardGrid from './card-grid.svelte'
  import CardGridCell from './card-grid-cell.svelte'

  const { Story } = defineMeta({
    title: 'Layout/CardGrid',
    component: CardGrid,
    tags: ['mise'],
    args: { columns: 2 },
    argTypes: { columns: { control: 'inline-radio', options: [2, 3, 4] } },
  })

  const zones = [
    { name: 'Ambient', units: 212 },
    { name: 'Chilled', units: 41 },
    { name: 'Frozen', units: 59 },
    { name: 'Dry storage', units: 340 },
  ]

  const accounts = [
    { name: 'Revenue', tone: 'success', amount: '$84,200.00' },
    { name: 'Tax liability', tone: 'warning', amount: '$6,340.00' },
    { name: 'Contra revenue', tone: 'neutral', amount: '−$1,120.00' },
    { name: 'Cash and receivables', tone: 'info', amount: '$79,760.00' },
  ] as const
</script>

<!--
  Plain content: a label and a figure, nothing measuring a share of a whole.
  `MetricGrid` is the wrong tool here, with no proportion to draw, just
  independent totals side by side.
-->
<Story name="Playground">
  {#snippet template(args)}
    <Card class="max-w-2xl">
      <CardHeader><CardTitle>Storage zones</CardTitle></CardHeader>
      <CardContent>
        <CardGrid {...args}>
          {#each zones as zone (zone.name)}
            <CardGridCell>
              <p class="text-muted-foreground text-sm">{zone.name}</p>
              <p class="text-lg font-medium">{zone.units} units</p>
            </CardGridCell>
          {/each}
        </CardGrid>
      </CardContent>
    </Card>
  {/snippet}
</Story>

<!--
  Four columns, a badge and a figure per cell: a small, fixed set of
  categorised totals, where a share of a whole would be meaningless because
  the categories are not parts of one sum.
-->
<Story name="Categorised totals" asChild>
  <Card>
    <CardHeader><CardTitle>Accounts</CardTitle></CardHeader>
    <CardContent>
      <CardGrid columns={4}>
        {#each accounts as account (account.name)}
          <CardGridCell class="flex flex-col items-start gap-2">
            <Badge tone={account.tone}>{account.name}</Badge>
            <p class="text-lg font-medium tabular-nums">{account.amount}</p>
          </CardGridCell>
        {/each}
      </CardGrid>
    </CardContent>
  </Card>
</Story>
