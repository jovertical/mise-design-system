<!-- For the anatomy. -->
<script lang="ts">
  import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    FeaturePreview,
    Text,
  } from '@jovertical/mise-design-system'

  const ORDERS = [
    { number: 'PO-1042', supplier: 'North Mill', status: 'Sent', total: '$1,240.00' },
    { number: 'PO-1043', supplier: 'Harbour Dairy', status: 'Received', total: '$384.50' },
    { number: 'PO-1044', supplier: 'Coastal Packaging', status: 'Draft', total: '$96.00' },
  ]
</script>

{#snippet orders()}
  <Card>
    <CardHeader class="border-b"><CardTitle>Purchase orders</CardTitle></CardHeader>
    <CardContent class="flex flex-col divide-y">
      {#each ORDERS as order (order.number)}
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

<div class="w-[44rem]">
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
</div>
