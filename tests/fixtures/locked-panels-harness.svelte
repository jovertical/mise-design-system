<script lang="ts">
  import { Button, FeaturePreview, LockedOverlay } from '../../src/lib/index.js'

  let {
    which = 'overlay',
    secondary = true,
  }: { which?: 'overlay' | 'preview'; secondary?: boolean } = $props()
</script>

{#snippet ask()}
  <Button size="sm">Ask for access</Button>
{/snippet}
{#snippet turnOn()}
  <Button>Turn on purchase orders</Button>
{/snippet}
{#snippet learn()}
  <Button variant="ghost">Learn more</Button>
{/snippet}
{#snippet sample()}
  <a href="#secret">Top product: Ensaymada</a>
{/snippet}

{#if which === 'overlay'}
  <LockedOverlay
    title="Sales by location"
    message="See which location sells the most."
    action={ask}
  >
    {@render sample()}
  </LockedOverlay>
{:else}
  <FeaturePreview
    title="Purchase orders"
    headline="Reorder from your suppliers in a few taps"
    benefits={['Raise orders from low stock.', 'Receive deliveries in part.']}
    preview={sample}
    primaryAction={turnOn}
    secondaryAction={secondary ? learn : undefined}
  />
{/if}
