<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Button from '../../actions/button/button.svelte'
  import Badge from '../../data-display/badge/badge.svelte'
  import Card from '../../layout/card/card.svelte'
  import CardContent from '../../layout/card/card-content.svelte'
  import CardHeader from '../../layout/card/card-header.svelte'
  import CardTitle from '../../layout/card/card-title.svelte'
  import Text from '../../typography/text/text.svelte'
  import FeaturePreview from './feature-preview.svelte'

  const { Story } = defineMeta({
    title: 'Feedback/FeaturePreview',
    component: FeaturePreview,
    tags: ['mise'],
  })

  const SAMPLE_ORDERS = [
    {
      number: 'PO-0142',
      supplier: 'Golden Grain Mills',
      status: 'Partly received',
      total: '$184.50',
    },
    { number: 'PO-0141', supplier: 'Dairy Fresh Co.', status: 'Confirmed', total: '$79.20' },
    { number: 'PO-0140', supplier: 'Sweet Source Trading', status: 'Received', total: '$123.00' },
    { number: 'PO-0139', supplier: 'Golden Grain Mills', status: 'Received', total: '$210.10' },
  ]
</script>

{#snippet orders()}
  <Card>
    <CardHeader class="border-b"><CardTitle>Purchase orders</CardTitle></CardHeader>
    <CardContent class="flex flex-col divide-y">
      {#each SAMPLE_ORDERS as order (order.number)}
        <div class="flex items-center justify-between gap-4 py-3">
          <div class="flex flex-col">
            <Text weight="medium">{order.number}</Text>
            <Text size="xs" muted>{order.supplier}</Text>
          </div>
          <Badge>{order.status}</Badge>
          <Text numeric>{order.total}</Text>
        </div>
      {/each}
    </CardContent>
  </Card>
{/snippet}
{#snippet turnOn()}
  <Button>Turn on purchase orders</Button>
{/snippet}
{#snippet learnMore()}
  <Button variant="ghost">Learn more</Button>
{/snippet}

<!--
  The page a reader lands on when purchase orders are not turned on for their
  location: what the feature does, a blurred picture of it, and the way in.
-->
<Story name="Playground" asChild>
  <FeaturePreview
    title="Purchase orders"
    headline="Reorder from your suppliers in a few taps"
    benefits={[
      'Raise orders from the stock you are running low on.',
      'Receive deliveries in full or in part, and stock updates itself.',
      'See what each supplier is owed at a glance.',
    ]}
    preview={orders}
    primaryAction={turnOn}
    secondaryAction={learnMore}
  />
</Story>

<!-- Long benefits wrap inside the card's measure rather than widening it. -->
<Story name="Long content" asChild>
  <FeaturePreview
    title="Purchase orders"
    headline="Reorder from your suppliers without the back-and-forth over chat and paper"
    benefits={[
      'Raise purchase orders straight from the items your locations are running low on, with the supplier and pack size you last bought them in already filled in.',
      'Receive a delivery in full or in part: short deliveries stay open until the rest arrives, and stock updates the moment you confirm what came in.',
    ]}
    preview={orders}
    primaryAction={turnOn}
    secondaryAction={learnMore}
  />
</Story>

<!-- Without a secondary action the primary stands alone. -->
<Story name="Primary only" asChild>
  <FeaturePreview
    title="Purchase orders"
    headline="Reorder from your suppliers in a few taps"
    benefits={['Raise orders from low stock.', 'Receive deliveries in part.']}
    preview={orders}
    primaryAction={turnOn}
  />
</Story>
