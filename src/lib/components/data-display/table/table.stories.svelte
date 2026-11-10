<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconCoins from '@tabler/icons-svelte-runes/icons/coins'
  import IconReceipt from '@tabler/icons-svelte-runes/icons/receipt'
  import IconStack2 from '@tabler/icons-svelte-runes/icons/stack-2'
  import type { Component } from 'svelte'

  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import Input from '../../forms/input/input.svelte'
  import Card from '../../layout/card/card.svelte'
  import CardAction from '../../layout/card/card-action.svelte'
  import CardContent from '../../layout/card/card-content.svelte'
  import CardDescription from '../../layout/card/card-description.svelte'
  import CardHeader from '../../layout/card/card-header.svelte'
  import CardTitle from '../../layout/card/card-title.svelte'
  import Badge from '../badge/badge.svelte'
  import IconChip from '../icon-chip/icon-chip.svelte'
  import Table from './table.svelte'
  import TableBody from './table-body.svelte'
  import TableCell from './table-cell.svelte'
  import TableFooter from './table-footer.svelte'
  import TableHead from './table-head.svelte'
  import TableHeader from './table-header.svelte'
  import TableRow from './table-row.svelte'

  const { Story } = defineMeta({
    title: 'Data display/Table',
    component: Table,
    tags: ['shadcn'],
    argTypes: { compact: { control: 'boolean' } },
  })

  const lines = [
    { item: 'Cold brew concentrate', qty: 1, unit: '$18.99', total: '$18.99' },
    { item: 'Oat milk, 1 L', qty: 2, unit: '$12.50', total: '$25.00' },
    { item: 'Espresso beans, 1 kg', qty: 1, unit: '$8.99', total: '$8.99' },
  ]

  const transfers = [
    {
      ref: 'ST-2026-0142',
      direction: 'Incoming',
      location: 'Riverside',
      raised: '09:12',
      status: 'In transit',
    },
    {
      ref: 'ST-2026-0139',
      direction: 'Outgoing',
      location: 'Harbour',
      raised: '10:04',
      status: 'In transit',
    },
    {
      ref: 'ST-2026-0137',
      direction: 'Outgoing',
      location: 'Riverside',
      raised: '11:38',
      status: 'Completed',
    },
    {
      ref: 'ST-2026-0135',
      direction: 'Incoming',
      location: 'Harbour',
      raised: '13:20',
      status: 'Draft',
    },
  ]

  const adjustments = [
    { item: 'Cold brew concentrate, 1 L', sku: 'BEV-021', before: 22, delta: -3, after: 19 },
    { item: 'Oat milk, 1 L, case of 6', sku: 'DAI-034', before: 30, delta: -4, after: 26 },
    { item: 'Paper cups, 12 oz, sleeve', sku: 'PKG-018', before: 21, delta: -5, after: 16 },
  ]

  const movements = [
    {
      date: '21 Mar 2026',
      type: 'Adjustment',
      note: 'Cycle count correction: three units found behind the back-room shelving',
      operator: 'Ana Cruz',
    },
    {
      date: '05 Dec 2025',
      type: 'Waste',
      note: 'Two units water-damaged in transit and written off on receipt',
      operator: 'Ben Ortiz',
    },
    {
      date: '12 Jul 2025',
      type: 'Transfer',
      note: 'Moved to Harbour against ST-2025-0881',
      operator: 'Ana Cruz',
    },
  ]

  const access = [
    { resource: 'Stock', hint: 'adjustments, transfers', staff: 2, managers: 5 },
    { resource: 'Orders', hint: 'refunds, voids', staff: 3, managers: 4 },
    { resource: 'Price lists', hint: null, staff: 1, managers: 2 },
  ]

  const summary: { icon: Component; label: string; value: string }[] = [
    { icon: IconStack2, label: 'Subtotal', value: '$52.98' },
    { icon: IconReceipt, label: 'Tax', value: '$5.67' },
    { icon: IconCoins, label: 'Total', value: '$58.65' },
  ]
</script>

{#snippet summaryStrip()}
  <dl class="grid grid-cols-1 gap-4 sm:grid-cols-3">
    {#each summary as figure (figure.label)}
      <div class="flex items-center gap-3">
        <IconChip tone="primary"><figure.icon /></IconChip>
        <div class="flex min-w-0 flex-col">
          <dt class="text-muted-foreground text-xs font-normal">{figure.label}</dt>
          <dd class="font-heading text-sm font-semibold tabular-nums">{figure.value}</dd>
        </div>
      </div>
    {/each}
  </dl>
{/snippet}

{#snippet movementsTable()}
  <div class="overflow-hidden rounded-xl border">
    <Table compact>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Note</TableHead>
          <TableHead>Recorded by</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {#each movements as movement (movement.date)}
          <TableRow>
            <TableCell class="tabular-nums">{movement.date}</TableCell>
            <TableCell class="font-medium">{movement.type}</TableCell>
            <TableCell class="text-muted-foreground whitespace-normal">{movement.note}</TableCell>
            <TableCell class="text-muted-foreground">{movement.operator}</TableCell>
          </TableRow>
        {/each}
      </TableBody>
    </Table>
  </div>
{/snippet}

<!--
  Rows carry a hover fill and a bottom rule; the last drops its rule. Money
  columns are `numeric`: right-aligned with tabular figures, so a column of
  prices lines up at the decimal point.
-->
<Story name="Playground">
  {#snippet template(args)}
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead numeric>Qty</TableHead>
          <TableHead numeric>Unit price</TableHead>
          <TableHead numeric>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {#each lines as line (line.item)}
          <TableRow>
            <TableCell class="font-medium">{line.item}</TableCell>
            <TableCell numeric>{line.qty}</TableCell>
            <TableCell numeric>{line.unit}</TableCell>
            <TableCell numeric>{line.total}</TableCell>
          </TableRow>
        {/each}
      </TableBody>
    </Table>
  {/snippet}
</Story>

<!--
  `compact` tightens heads and cells together: a listing, where a row is a click
  target, wants the default; a table being read, where figures are compared,
  wants compact.
-->
<Story name="Densities" asChild>
  <StoryAxis values={['default', 'compact'] as const} orientation="vertical">
    {#snippet item(density)}
      <div class="overflow-hidden rounded-xl border">
        <Table compact={density === 'compact'}>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {#each transfers as transfer (transfer.ref)}
              <TableRow>
                <TableCell class="font-medium">{transfer.ref}</TableCell>
                <TableCell>{transfer.location}</TableCell>
                <TableCell class="text-muted-foreground">{transfer.status}</TableCell>
              </TableRow>
            {/each}
          </TableBody>
        </Table>
      </div>
    {/snippet}
  </StoryAxis>
</Story>

<!--
  An editable row refused. The whole row carries the error: a destructive tint
  (kept on hover, which would otherwise wipe it from the row being corrected),
  `aria-invalid` on the input, the derived figure in red, and one line saying
  why beside the control rather than in a summary above. A derived column, New
  qty, is worth its width: it shows where the entry lands.
-->
<Story name="States" asChild>
  <div class="max-w-3xl">
    <Table compact>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead numeric>On hand</TableHead>
          <TableHead class="w-36">Adjustment</TableHead>
          <TableHead numeric>New qty</TableHead>
          <TableHead class="w-28">Unit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell class="font-medium">Oat milk, 1 L, case of 6</TableCell>
          <TableCell numeric class="text-muted-foreground">30</TableCell>
          <TableCell
            ><Input value="-4" aria-label="Adjustment" class="text-right tabular-nums" /></TableCell
          >
          <TableCell numeric class="font-medium">26</TableCell>
          <TableCell class="text-muted-foreground">each</TableCell>
        </TableRow>
        <TableRow class="bg-destructive-soft hover:bg-destructive-soft">
          <TableCell class="font-medium">Espresso grinder burrs</TableCell>
          <TableCell numeric class="text-muted-foreground">9</TableCell>
          <TableCell>
            <div class="flex flex-col gap-1">
              <Input
                aria-invalid="true"
                value="-21"
                aria-label="Adjustment"
                class="text-right tabular-nums"
              />
              <p class="text-destructive text-xs">Would drive stock negative</p>
            </div>
          </TableCell>
          <TableCell numeric class="text-destructive font-medium">-12</TableCell>
          <TableCell class="text-muted-foreground">each</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</Story>

<!--
  The whole card: a heading, a count in `CardAction`, and the table run
  full-bleed (`px-0` on the content, the padding moved to the first and last
  columns) so its rules reach the card's edges.
-->
<Story name="In a card" asChild>
  <Card>
    <CardHeader>
      <CardTitle>Items</CardTitle>
      <CardDescription>What was sold on this order</CardDescription>
      <CardAction><Badge variant="outline">3 items</Badge></CardAction>
    </CardHeader>
    <CardContent class="px-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="pl-6">Item</TableHead>
            <TableHead numeric>Qty</TableHead>
            <TableHead numeric class="pr-6">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {#each lines as line (line.item)}
            <TableRow>
              <TableCell class="pl-6 font-medium">{line.item}</TableCell>
              <TableCell numeric>{line.qty}</TableCell>
              <TableCell numeric class="pr-6">{line.total}</TableCell>
            </TableRow>
          {/each}
        </TableBody>
        <TableFooter>
          <TableRow class="hover:bg-transparent">
            <TableCell colspan={3} class="px-6 py-4">{@render summaryStrip()}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </CardContent>
  </Card>
</Story>

<!--
  A card whose whole content is the table. No ring: the card's edge is the
  table's. It needs something to close the bottom, since the last row drops its
  rule; a footer does it, or else reach for the bordered shape below.
-->
<Story name="In a card, compact" asChild>
  <Card>
    <CardHeader divided>
      <CardTitle>Transfers today</CardTitle>
      <CardAction><Badge variant="outline">4 transfers</Badge></CardAction>
    </CardHeader>
    <CardContent class="px-0">
      <Table compact>
        <TableHeader>
          <TableRow>
            <TableHead class="pl-6">Reference</TableHead>
            <TableHead>Direction</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Raised</TableHead>
            <TableHead class="pr-6">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {#each transfers as transfer (transfer.ref)}
            <TableRow>
              <TableCell class="pl-6 font-medium">{transfer.ref}</TableCell>
              <TableCell><Badge variant="outline">{transfer.direction}</Badge></TableCell>
              <TableCell class="text-muted-foreground">{transfer.location}</TableCell>
              <TableCell class="text-muted-foreground tabular-nums">{transfer.raised}</TableCell>
              <TableCell class="text-muted-foreground pr-6">{transfer.status}</TableCell>
            </TableRow>
          {/each}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</Story>

<!--
  The ringed table, the shape to reach for when in doubt: the ring closes the
  bottom, and the table reads as an object the card contains. `overflow-hidden`
  on the ring keeps its corners round. `whitespace-normal` on the one column
  that holds a sentence.
-->
<Story name="In a card with a border" asChild>
  <Card>
    <CardHeader><CardTitle>Stock movements</CardTitle></CardHeader>
    <CardContent>{@render movementsTable()}</CardContent>
  </Card>
</Story>

<!--
  The ringed table closed by totals, for a document whose columns sum. Only
  total what shares a unit. The leading label spans the identity columns;
  nothing to its right moves.
-->
<Story name="In a card with a border and footer" asChild>
  <Card>
    <CardHeader><CardTitle>Line items</CardTitle></CardHeader>
    <CardContent>
      <div class="overflow-hidden rounded-xl border">
        <Table compact>
          <TableHeader>
            <TableRow>
              <TableHead class="w-10">#</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead numeric>Current qty</TableHead>
              <TableHead numeric>Adjustment</TableHead>
              <TableHead numeric>New qty</TableHead>
              <TableHead>Unit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {#each adjustments as line, index (line.sku)}
              <TableRow>
                <TableCell class="text-muted-foreground">{index + 1}</TableCell>
                <TableCell class="font-medium">{line.item}</TableCell>
                <TableCell class="text-muted-foreground">{line.sku}</TableCell>
                <TableCell numeric>{line.before}</TableCell>
                <TableCell numeric class="text-destructive font-medium">{line.delta}</TableCell>
                <TableCell numeric>{line.after}</TableCell>
                <TableCell class="text-muted-foreground">each</TableCell>
              </TableRow>
            {/each}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colspan={3}>Totals</TableCell>
              <TableCell numeric>73</TableCell>
              <TableCell numeric class="text-destructive">-12</TableCell>
              <TableCell numeric>61</TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </CardContent>
  </Card>
</Story>

<!--
  Standing facts above a history, in one card because they are about the same
  thing. Plain muted boxes, not `StatTile`, which draws a card of its own; and
  not a footer, since an on-hand figure is not the sum of the movements.
-->
<Story name="In a card with a border and figures" asChild>
  <Card>
    <CardHeader><CardTitle>Stock movements</CardTitle></CardHeader>
    <CardContent class="flex flex-col gap-4">
      <dl class="grid gap-3 sm:grid-cols-3">
        {#each [
          { label: 'On hand', value: '1,240 units' },
          { label: 'Reorder point', value: '400 units' },
          { label: 'Last counted', value: '21 Mar 2026' },
        ] as figure (figure.label)}
          <div class="bg-muted/40 flex flex-col gap-1 rounded-xl border px-4 py-3">
            <dt class="text-muted-foreground text-xs">{figure.label}</dt>
            <dd class="font-heading text-sm font-semibold tabular-nums">{figure.value}</dd>
          </div>
        {/each}
      </dl>
      {@render movementsTable()}
    </CardContent>
  </Card>
</Story>

<!--
  `strong` for a header naming what the table compares rather than captioning a
  column of values. A count under one stays muted.
-->
<Story name="Strong headers" asChild>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead strong>Resource</TableHead>
        <TableHead strong
          >Staff
          <div class="text-muted-foreground text-xs font-normal">12 users</div></TableHead
        >
        <TableHead strong
          >Managers
          <div class="text-muted-foreground text-xs font-normal">3 users</div></TableHead
        >
      </TableRow>
    </TableHeader>
    <TableBody>
      {#each access as row (row.resource)}
        <TableRow>
          <TableCell>
            <div class="font-medium">{row.resource}</div>
            {#if row.hint}
              <div class="text-muted-foreground text-xs">{row.hint}</div>
            {/if}
          </TableCell>
          <TableCell>{row.staff} granted</TableCell>
          <TableCell>{row.managers} granted</TableCell>
        </TableRow>
      {/each}
    </TableBody>
  </Table>
</Story>

<!--
  A total that lines up with the column it totals. Empty cells rather than a
  `colspan` for columns with no total, or the figures drift off their headers.
-->
<Story name="Column totals" asChild>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Item</TableHead>
        <TableHead numeric>Qty</TableHead>
        <TableHead numeric>Unit price</TableHead>
        <TableHead numeric>Total</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {#each lines as line (line.item)}
        <TableRow>
          <TableCell class="font-medium">{line.item}</TableCell>
          <TableCell numeric>{line.qty}</TableCell>
          <TableCell numeric>{line.unit}</TableCell>
          <TableCell numeric>{line.total}</TableCell>
        </TableRow>
      {/each}
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell>Totals</TableCell>
        <TableCell numeric>4</TableCell>
        <TableCell />
        <TableCell numeric>$52.98</TableCell>
      </TableRow>
    </TableFooter>
  </Table>
</Story>

<!--
  Figures that do not belong to a column (subtotal, tax, total) span the width
  as a strip in one `colspan` cell. Still a `tfoot`: they summarise the table.
-->
<Story name="Summary strip" asChild>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Item</TableHead>
        <TableHead numeric>Qty</TableHead>
        <TableHead numeric>Unit price</TableHead>
        <TableHead numeric>Total</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {#each lines as line (line.item)}
        <TableRow>
          <TableCell class="font-medium">{line.item}</TableCell>
          <TableCell numeric>{line.qty}</TableCell>
          <TableCell numeric>{line.unit}</TableCell>
          <TableCell numeric>{line.total}</TableCell>
        </TableRow>
      {/each}
    </TableBody>
    <TableFooter>
      <TableRow class="hover:bg-transparent">
        <TableCell colspan={4} class="px-4 py-4">{@render summaryStrip()}</TableCell>
      </TableRow>
    </TableFooter>
  </Table>
</Story>

<!--
  Two facts about one thing in one cell: the name over its code. Two wide
  identifiers side by side push every figure off the right edge; stacked, the
  code reads as subordinate, and `min-w-0` lets the name truncate. Only for a
  second value that identifies the first.
-->
<Story name="Stacked identity cell" asChild>
  <div class="overflow-hidden rounded-xl border">
    <Table compact>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead numeric>Current qty</TableHead>
          <TableHead numeric>Adjustment</TableHead>
          <TableHead numeric>New qty</TableHead>
          <TableHead>Unit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {#each adjustments as line (line.sku)}
          <TableRow>
            <TableCell>
              <div class="flex min-w-0 flex-col">
                <span class="truncate font-medium">{line.item}</span>
                <span class="text-muted-foreground text-xs">{line.sku}</span>
              </div>
            </TableCell>
            <TableCell numeric>{line.before}</TableCell>
            <TableCell numeric class="text-destructive font-medium">{line.delta}</TableCell>
            <TableCell numeric>{line.after}</TableCell>
            <TableCell class="text-muted-foreground">each</TableCell>
          </TableRow>
        {/each}
      </TableBody>
    </Table>
  </div>
</Story>
