<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Card from '../../layout/card/card.svelte'
  import CardAction from '../../layout/card/card-action.svelte'
  import CardContent from '../../layout/card/card-content.svelte'
  import CardHeader from '../../layout/card/card-header.svelte'
  import CardTitle from '../../layout/card/card-title.svelte'
  import MetricGrid, { type MetricGridItem } from './metric-grid.svelte'

  const categories: MetricGridItem[] = [
    { id: 'breads', label: 'Breads', description: '12 items', percent: 28, trailing: '28%' },
    { id: 'pastries', label: 'Pastries', description: '9 items', percent: 21, trailing: '21%' },
    { id: 'drinks', label: 'Drinks', description: '8 items', percent: 19, trailing: '19%' },
    { id: 'cakes', label: 'Cakes', description: '6 items', percent: 14, trailing: '14%' },
    { id: 'packaging', label: 'Packaging', description: '5 items', percent: 12, trailing: '12%' },
    { id: 'none', label: 'Uncategorised', description: '3 items', percent: 6, trailing: '6%' },
  ]

  const { Story } = defineMeta({
    title: 'Data display/MetricGrid',
    component: MetricGrid,
    tags: ['mise'],
    args: { items: categories, columns: 3 },
    argTypes: { columns: { control: 'inline-radio', options: [2, 3] } },
  })
</script>

<!--
  Stock split by category: sub-groups compared against each other, so they sit
  side by side; a list would have them read in order, and there is no order.
  The legend sits in the card's action slot because it describes every cell.
-->
<Story name="Playground">
  {#snippet template(args)}
    <Card>
      <CardHeader>
        <CardTitle>Stock by category</CardTitle>
        <CardAction>
          <span class="text-muted-foreground flex items-center gap-1.5 text-xs">
            <span class="bg-primary size-2 rounded-full"></span>
            Share of tracked items
          </span>
        </CardAction>
      </CardHeader>
      <CardContent><MetricGrid {...args} /></CardContent>
    </Card>
  {/snippet}
</Story>

<!--
  Two columns, for a breakdown with fewer parts. Three columns and four items
  leaves an orphan; only the caller knows how many items there are.
-->
<Story name="Two columns" asChild>
  <Card>
    <CardHeader><CardTitle>Capacity by dock</CardTitle></CardHeader>
    <CardContent>
      <MetricGrid
        columns={2}
        items={[
          { id: '1', label: 'Dock 1', value: '18 / 24', percent: 75, trailing: '75%' },
          { id: '2', label: 'Dock 2', value: '20 / 24', percent: 83, trailing: '83%' },
          { id: '3', label: 'Dock 3', value: '6 / 24', percent: 25, trailing: '25%' },
          {
            id: '4',
            label: 'Dock 4',
            value: '22 / 24',
            percent: 92,
            tone: 'warning',
            trailing: '92%',
          },
        ]}
      />
    </CardContent>
  </Card>
</Story>

<!--
  Tone colours one cell's fill, never all of them. A grid where every bar is
  coloured says nothing; one warning bar among several says where to look.
-->
<Story name="One toned cell" asChild>
  <Card>
    <CardHeader><CardTitle>Stock health by zone</CardTitle></CardHeader>
    <CardContent>
      <MetricGrid
        items={[
          { id: 'ambient', label: 'Ambient', value: '212 units', percent: 68, trailing: '68%' },
          {
            id: 'chilled',
            label: 'Chilled',
            value: '41 units',
            percent: 13,
            tone: 'warning',
            trailing: '13%',
          },
          { id: 'frozen', label: 'Frozen', value: '59 units', percent: 19, trailing: '19%' },
        ]}
      />
    </CardContent>
  </Card>
</Story>
