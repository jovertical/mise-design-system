<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Button from '../../actions/button/button.svelte'
  import MetricBar from '../../data-display/metric-bar/metric-bar.svelte'
  import Card from '../../layout/card/card.svelte'
  import CardContent from '../../layout/card/card-content.svelte'
  import CardDescription from '../../layout/card/card-description.svelte'
  import CardHeader from '../../layout/card/card-header.svelte'
  import CardTitle from '../../layout/card/card-title.svelte'
  import Text from '../../typography/text/text.svelte'
  import LockedOverlay from './locked-overlay.svelte'

  const { Story } = defineMeta({
    title: 'Feedback/LockedOverlay',
    component: LockedOverlay,
    tags: ['mise'],
  })

  const SAMPLE_PRODUCTS = [
    { name: 'Ensaymada', revenue: '$124.80' },
    { name: 'Pandesal (10 pcs)', revenue: '$96.50' },
    { name: 'Ube cheese roll', revenue: '$72.10' },
    { name: 'Spanish bread', revenue: '$53.30' },
  ]
</script>

{#snippet askManager()}
  <Button size="sm">Ask a manager for access</Button>
{/snippet}
{#snippet finishSetup()}
  <Button size="sm">Finish setup</Button>
{/snippet}

<!--
  A top-products card the reader's role cannot open: the frame and header
  stay, the body is a blurred sample with the pitch over it.
-->
<Story name="Playground" asChild>
  <Card class="max-w-md">
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
          {#each SAMPLE_PRODUCTS as product (product.name)}
            <div class="flex justify-between py-2">
              <Text>{product.name}</Text>
              <Text numeric>{product.revenue}</Text>
            </div>
          {/each}
        </div>
      </LockedOverlay>
    </CardContent>
  </Card>
</Story>

<!-- Over metric bars: a sales-mix card waiting on a setup step. -->
<Story name="Over metric bars" asChild>
  <Card class="max-w-md">
    <CardHeader class="border-b"><CardTitle>Sales mix</CardTitle></CardHeader>
    <CardContent>
      <LockedOverlay
        title="Sales by channel"
        message="Break sales down by location, channel and payment method once registers report."
        action={finishSetup}
      >
        <div class="flex flex-col gap-3 py-2">
          <MetricBar label="Dine-in" percent={54} value="54%" />
          <MetricBar label="Take-out" percent={31} value="31%" />
          <MetricBar label="Delivery" percent={15} value="15%" />
        </div>
      </LockedOverlay>
    </CardContent>
  </Card>
</Story>
