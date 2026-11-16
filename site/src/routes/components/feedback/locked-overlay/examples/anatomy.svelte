<!-- For the anatomy. -->
<script lang="ts">
  import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    LockedOverlay,
    Text,
  } from '@jovertical/mise-design-system'

  const PRODUCTS = [
    { name: 'Sourdough loaf', revenue: '$1,820.00' },
    { name: 'Croissant', revenue: '$1,240.50' },
    { name: 'Flat white', revenue: '$980.00' },
  ]
</script>

{#snippet askManager()}
  <Button size="sm">Ask a manager for access</Button>
{/snippet}

<Card class="w-96">
  <CardHeader class="border-b">
    <CardTitle>Top products</CardTitle>
    <CardDescription>Best sellers by revenue this week</CardDescription>
  </CardHeader>
  <CardContent>
    <LockedOverlay
      title="Sales by product"
      message="See which products earn the most, location by location."
      action={askManager}
    >
      <div class="flex flex-col divide-y">
        {#each PRODUCTS as product (product.name)}
          <div class="flex justify-between py-2">
            <Text>{product.name}</Text>
            <Text numeric>{product.revenue}</Text>
          </div>
        {/each}
      </div>
    </LockedOverlay>
  </CardContent>
</Card>
