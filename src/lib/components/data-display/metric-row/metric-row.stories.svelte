<script module lang="ts">
  import LayoutGridIcon from '@lucide/svelte/icons/layout-grid'
  import WarehouseIcon from '@lucide/svelte/icons/warehouse'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Button from '../../actions/button/button.svelte'
  import Card from '../../layout/card/card.svelte'
  import CardAction from '../../layout/card/card-action.svelte'
  import CardContent from '../../layout/card/card-content.svelte'
  import CardDescription from '../../layout/card/card-description.svelte'
  import CardHeader from '../../layout/card/card-header.svelte'
  import CardTitle from '../../layout/card/card-title.svelte'
  import CardList from '../../layout/card-list/card-list.svelte'
  import Badge from '../badge/badge.svelte'
  import MetricRow, { type MetricRowStat } from './metric-row.svelte'

  const { Story } = defineMeta({
    title: 'Data display/MetricRow',
    component: MetricRow,
    tags: ['mise'],
    args: {
      label: 'Riverside',
      description: 'North district · 22 items',
      percent: 80,
      trailing: '398 / 500 units',
    },
    argTypes: {
      percent: { control: { type: 'range', min: 0, max: 100 } },
      barPlacement: { control: 'inline-radio', options: ['below', 'inline'] },
      hideBar: { control: 'boolean' },
    },
  })

  const locations = [
    {
      name: 'Riverside',
      where: 'North district · 22 items',
      pct: 80,
      low: 3,
      out: 1,
      on: 398,
      cap: 500,
    },
    { name: 'Harbour', where: 'Waterfront · 19 items', pct: 64, low: 3, out: 0, on: 321, cap: 500 },
    {
      name: 'North yard',
      where: 'Industrial park · 16 items',
      pct: 46,
      low: 1,
      out: 2,
      on: 321,
      cap: 700,
    },
  ]

  function stockStats(row: { pct: number; low: number; out: number }): MetricRowStat[] {
    return [
      { id: 'available', label: 'Available', value: `${row.pct}%` },
      { id: 'low', label: 'Low stock', value: row.low, tone: row.low > 0 ? 'warning' : 'neutral' },
      {
        id: 'out',
        label: 'Out of stock',
        value: row.out,
        tone: row.out > 0 ? 'critical' : 'neutral',
      },
    ]
  }

  const health = [
    { name: 'Drinks', sub: '9 items · $29.4k value', pct: 56, badge: 'Critical' },
    { name: 'Bakery', sub: '4 items · $7.2k value', pct: 75, badge: 'Watch' },
    { name: 'Dairy', sub: '3 items · $3.6k value', pct: 33, badge: 'Critical' },
    { name: 'Dry goods', sub: '3 items · $1.5k value', pct: 140, badge: null },
  ] as const

  const comingDue = [
    { label: 'This week', percent: 1, amount: '$200.00' },
    { label: 'Next week', percent: 99, amount: '$72K' },
    { label: 'In 15–30 days', percent: 0, amount: '$0.00' },
  ]
</script>

{#snippet warehouse()}
  <WarehouseIcon />
{/snippet}
{#snippet category()}
  <LayoutGridIcon />
{/snippet}

<!-- A subject, three labelled figures, and a bar under the whole row. -->
<Story name="Playground">
  {#snippet template(args)}
    <Card class="max-w-2xl">
      <CardContent>
        <MetricRow icon={warehouse} stats={stockStats(locations[0])} {...args} />
      </CardContent>
    </Card>
  {/snippet}
</Story>

<!--
  The shape it was drawn for. The bar runs under the icon chip too: it
  summarises the row rather than belonging to the label beside it. Tone is spent
  on a few of the figures; a row where every number is coloured reads as an
  alert.
-->
<Story name="In a card list" asChild>
  <Card class="max-w-2xl">
    <CardHeader divided>
      <CardTitle>Stock by location</CardTitle>
      <CardDescription>Availability and low-stock risk by location.</CardDescription>
      <CardAction><Button variant="outline" size="sm">Manage locations</Button></CardAction>
    </CardHeader>
    <CardContent>
      <CardList>
        {#each locations as row (row.name)}
          <MetricRow
            icon={warehouse}
            label={row.name}
            description={row.where}
            stats={stockStats(row)}
            percent={row.pct}
            trailing="{row.on} / {row.cap} units"
          />
        {/each}
      </CardList>
    </CardContent>
  </Card>
</Story>

<!--
  `barPlacement="inline"`: the bar is the figure, so they stay on one line.
  Breaking it onto its own row below would separate a value from its own
  picture. The stats carry no caption; a lone percentage beside its bar
  explains itself.
-->
<Story name="Inline bar" asChild>
  <Card class="max-w-2xl">
    <CardHeader divided>
      <CardTitle>Stock health by category</CardTitle>
      <CardDescription>Available stock against recommended levels.</CardDescription>
    </CardHeader>
    <CardContent>
      <CardList>
        {#each health as row (row.name)}
          {#snippet badge()}
            <Badge tone={row.badge === 'Critical' ? 'critical' : 'warning'}>{row.badge}</Badge>
          {/snippet}
          <MetricRow
            icon={category}
            label={row.name}
            description={row.sub}
            barPlacement="inline"
            percent={row.pct}
            tone={row.badge === 'Critical'
              ? 'critical'
              : row.badge === 'Watch'
                ? 'warning'
                : 'success'}
            stats={[{ id: 'health', value: `${row.pct}%` }]}
            trailing={row.badge === null ? null : badge}
          />
        {/each}
      </CardList>
    </CardContent>
  </Card>
</Story>

<!--
  Inline bars before figures of different widths. The figure takes a
  right-aligned slot with a floor width, so every bar starts and ends at the
  same x, and the figures line up on their right edge.
-->
<Story name="Inline bar amounts" asChild>
  <Card class="max-w-sm">
    <CardHeader divided>
      <CardTitle>Coming due</CardTitle>
      <CardDescription>Unpaid invoices due in the next 30 days.</CardDescription>
    </CardHeader>
    <CardContent>
      <CardList>
        {#each comingDue as row (row.label)}
          <MetricRow
            label={row.label}
            barPlacement="inline"
            percent={row.percent}
            trailing={row.amount}
          />
        {/each}
      </CardList>
    </CardContent>
  </Card>
</Story>

<!--
  Without stats it is a titled row with a bar: close to `MetricBar`, which is
  probably the right reach. Here to show it does not fall apart.
-->
<Story name="Without stats" asChild>
  <Card class="max-w-xl">
    <CardHeader divided><CardTitle>Stock by category</CardTitle></CardHeader>
    <CardContent>
      <CardList>
        {#each [
          { name: 'Drinks', items: 24, share: 46 },
          { name: 'Bakery', items: 11, share: 31 },
          { name: 'Packaging', items: 8, share: 23 },
        ] as row (row.name)}
          <MetricRow
            icon={category}
            label={row.name}
            description="{row.items} items"
            stats={[{ id: 'share', label: 'Share', value: `${row.share}%` }]}
            percent={row.share}
          />
        {/each}
      </CardList>
    </CardContent>
  </Card>
</Story>

<!--
  `hideBar` for a row with nothing to measure. An empty bar reads as a
  rendering failure; its absence, with the row saying why, reads as an answer.
-->
<Story name="Nothing to measure" asChild>
  <Card class="max-w-2xl">
    <CardContent>
      <CardList>
        <MetricRow
          icon={warehouse}
          label="Riverside"
          description="North district · 22 items"
          stats={[
            { id: 'available', label: 'Available', value: '80%' },
            { id: 'low', label: 'Low stock', value: 3, tone: 'warning' },
          ]}
          percent={80}
          trailing="398 units on hand"
        />
        <MetricRow
          icon={warehouse}
          label="Commissary"
          description="No tracked stock levels"
          stats={[
            { id: 'available', label: 'Available', value: '—' },
            { id: 'low', label: 'Low stock', value: '—' },
          ]}
          percent={0}
          hideBar
        />
      </CardList>
    </CardContent>
  </Card>
</Story>

<!-- The bar clamps rather than overflowing. Anything over 100 is a bug upstream. -->
<Story name="Clamped" asChild>
  <Card class="max-w-xl">
    <CardContent stack="md">
      <MetricRow label="Reported" percent={140} trailing="140%" />
      <MetricRow label="Empty" percent={0} trailing="0%" />
    </CardContent>
  </Card>
</Story>
