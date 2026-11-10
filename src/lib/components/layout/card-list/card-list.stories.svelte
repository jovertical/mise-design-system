<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconBuildingStore from '@tabler/icons-svelte-runes/icons/building-store'

  import Button from '../../actions/button/button.svelte'
  import Item from '../../data-display/item/item.svelte'
  import ItemActions from '../../data-display/item/item-actions.svelte'
  import ItemContent from '../../data-display/item/item-content.svelte'
  import ItemDescription from '../../data-display/item/item-description.svelte'
  import ItemTitle from '../../data-display/item/item-title.svelte'
  import MetricBar from '../../data-display/metric-bar/metric-bar.svelte'

  import Card from '../card/card.svelte'
  import CardContent from '../card/card-content.svelte'
  import CardDescription from '../card/card-description.svelte'
  import CardFooter from '../card/card-footer.svelte'
  import CardHeader from '../card/card-header.svelte'
  import CardTitle from '../card/card-title.svelte'
  import CardList from './card-list.svelte'

  const { Story } = defineMeta({
    title: 'Layout/CardList',
    component: CardList,
    tags: ['mise'],
    argTypes: { compact: { control: 'boolean' } },
  })

  const sessions = [
    { label: 'Open', duration: '2h 14m', count: '5 registers' },
    { label: 'Idle', duration: '18m', count: '2 registers' },
    { label: 'Closed', duration: '—', count: '9 registers' },
  ]

  const locations = [
    { name: 'Riverside', where: 'North district · 22 items', used: 398, cap: 500 },
    { name: 'Harbour', where: 'Waterfront · 19 items', used: 321, cap: 500 },
    { name: 'North yard', where: 'Industrial park · 19 items', used: 338, cap: 450 },
    { name: 'Market street', where: 'Old town · 16 items', used: 321, cap: 700 },
  ]

  const steps = [
    'Count the float in the drawer.',
    'Record the total against the register.',
    'Lock the drawer and hand the key to the manager.',
  ]
</script>

<!--
  The rules reach the card's edges, and `divided` on the header divides it off
  from the list. Rows need not be anything in particular: the list supplies the
  padding and the rules, and nothing else.
-->
<Story name="Playground">
  {#snippet template(args)}
    <Card class="max-w-md">
      <CardHeader divided><CardTitle>Register sessions</CardTitle></CardHeader>
      <CardContent>
        <CardList {...args}>
          {#each sessions as row (row.label)}
            <div class="flex items-center justify-between gap-3 text-sm">
              <span>{row.label}</span>
              <span class="flex items-baseline gap-3 tabular-nums">
                <span class="font-medium">{row.duration}</span>
                <span class="text-muted-foreground">{row.count}</span>
              </span>
            </div>
          {/each}
        </CardList>
      </CardContent>
    </Card>
  {/snippet}
</Story>

<!--
  Item rows: each staff member with an action at the row's end. The list draws
  the rules and the padding; the rows bring the title, the line under it and
  the action. `divided` on the header and footer closes the list off.
-->
<Story name="With item rows" asChild>
  <Card class="max-w-2xl">
    <CardHeader divided>
      <CardTitle>Staffing</CardTitle>
      <CardDescription>2 assigned to this location.</CardDescription>
    </CardHeader>
    <CardContent>
      <CardList>
        {#each [
          { name: 'Dana', role: 'Manager' },
          { name: 'Eli', role: 'Staff' },
        ] as person (person.name)}
          <Item>
            <ItemContent>
              <ItemTitle>{person.name}</ItemTitle>
              <ItemDescription>{person.role}</ItemDescription>
            </ItemContent>
            <ItemActions><Button variant="outline" size="sm">Un-assign</Button></ItemActions>
          </Item>
        {/each}
      </CardList>
    </CardContent>
    <CardFooter divided class="justify-end">
      <Button variant="outline" size="sm">Assign staff</Button>
    </CardFooter>
  </Card>
</Story>

<!--
  `compact` for rows of one line. The default height is sized for a leading
  chip and two lines; a numbered procedure has neither, and at `py-4` it reads
  as spaced out rather than divided. The number is `size-5`, matching
  `text-sm`'s line box, so it aligns with the first line without a nudge.
-->
<Story name="Compact rows" asChild>
  <Card class="max-w-2xl">
    <CardHeader divided>
      <CardTitle>Closing the till</CardTitle>
      <CardDescription>In the order it is done.</CardDescription>
    </CardHeader>
    <CardContent>
      <CardList compact>
        {#each steps as step, index (step)}
          <div class="flex items-start gap-3">
            <span
              aria-hidden="true"
              class="bg-foreground text-background flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums"
            >
              {index + 1}
            </span>
            <p class="min-w-0 flex-1 text-sm">{step}</p>
          </div>
        {/each}
      </CardList>
    </CardContent>
  </Card>
</Story>

<!--
  `MetricBar` rows, the list's most common content: each row a chip, two lines
  and a bar, at the default `py-4`.
-->
<Story name="Metric bar rows" asChild>
  <Card class="max-w-2xl">
    <CardHeader divided>
      <CardTitle>Stock by location</CardTitle>
      <CardDescription>Capacity and low-stock risk by location.</CardDescription>
    </CardHeader>
    <CardContent>
      <CardList>
        {#each locations as row (row.name)}
          {#snippet icon()}
            <IconBuildingStore />
          {/snippet}
          <MetricBar
            {icon}
            label={row.name}
            description={row.where}
            value="{Math.round((row.used / row.cap) * 100)}%"
            percent={(row.used / row.cap) * 100}
            trailing="{row.used} / {row.cap} units"
          />
        {/each}
      </CardList>
    </CardContent>
  </Card>
</Story>
